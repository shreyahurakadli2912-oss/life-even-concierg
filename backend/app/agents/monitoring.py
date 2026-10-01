from datetime import datetime
from typing import Dict, Any, Tuple, List
from app.models.schemas import Journey, TaskStatus, AgentActivity
from app.agents.dependency_engine import dependency_engine
from app.agents.next_best_action import next_best_action_agent

class MonitoringAgent:
    def process_action_result(self, journey: Journey, task_id: str, action_title: str) -> Journey:
        now = datetime.now().strftime("%H:%M:%S")
        
        # 1. Update target task status to COMPLETED
        target_found = False
        for t in journey.tasks:
            if t.task_id == task_id or (task_id == "complete" and t.status in [TaskStatus.READY, TaskStatus.IN_PROGRESS]):
                t.status = TaskStatus.COMPLETED
                target_found = True
                break

        if not target_found and journey.tasks:
            # Fallback: complete the first READY task if task_id wasn't an exact match
            for t in journey.tasks:
                if t.status in [TaskStatus.READY, TaskStatus.IN_PROGRESS]:
                    t.status = TaskStatus.COMPLETED
                    break

        # 2. Add Activity Log
        journey.activities.append(AgentActivity(
            id=f"act_log_{len(journey.activities)+1}",
            timestamp=now,
            agent_name="Monitoring & Replanning Agent",
            message=f"Action '{action_title}' executed. Evaluated task graph & recalculated unlocked dependencies.",
            status="COMPLETED"
        ))

        # 3. Recalculate task dependencies and overall progress
        updated_tasks, progress = dependency_engine.evaluate_graph(journey.tasks)
        journey.tasks = updated_tasks
        journey.progress_percentage = progress
        journey.updated_at = datetime.now().isoformat()

        # 4. Recalculate Next Best Action dynamically!
        new_next_action = next_best_action_agent.determine_next_action(journey.tasks, journey.event_type.value)
        journey.next_best_action = new_next_action

        if new_next_action:
            journey.activities.append(AgentActivity(
                id=f"act_log_{len(journey.activities)+1}",
                timestamp=now,
                agent_name="Next Best Action Agent",
                message=f"New Next Best Action identified: '{new_next_action.action_title}'",
                status="READY"
            ))

        return journey

monitoring_agent = MonitoringAgent()
