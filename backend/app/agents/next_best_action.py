from typing import List, Optional
from app.models.schemas import TaskItem, TaskStatus, NextBestAction

class NextBestActionAgent:
    def determine_next_action(self, tasks: List[TaskItem], event_type_str: str) -> Optional[NextBestAction]:
        # 1. Look for READY or IN_PROGRESS tasks sorted by priority (1 is highest priority)
        ready_tasks = [t for t in tasks if t.status in [TaskStatus.READY, TaskStatus.IN_PROGRESS]]
        ready_tasks.sort(key=lambda x: x.priority)
        
        if ready_tasks:
            top_task = ready_tasks[0]
            
            # Construct human-understandable reasoning
            reasoning = (
                f"Task '{top_task.title}' is currently unlocked and has highest priority. "
                f"Reason: {top_task.reason}"
            )
            
            return NextBestAction(
                action_title=f"Execute: {top_task.title}",
                description=top_task.next_action,
                target_task_id=top_task.task_id,
                reasoning=reasoning,
                urgency="High" if top_task.priority == 1 else "Medium",
                requires_approval=True,
                proposed_payload={
                    "task_id": top_task.task_id,
                    "service_id": top_task.relevant_service_id,
                    "documents_required": top_task.required_documents
                }
            )

        # 2. If no READY tasks, check for BLOCKED tasks
        blocked_tasks = [t for t in tasks if t.status == TaskStatus.BLOCKED]
        if blocked_tasks:
            b_task = blocked_tasks[0]
            return NextBestAction(
                action_title=f"Resolve Blocked Task: {b_task.title}",
                description=f"Action required to unblock: {b_task.description}",
                target_task_id=b_task.task_id,
                reasoning="This task is currently blocked due to missing context or unverified documents.",
                urgency="High",
                requires_approval=False
            )

        # 3. Check if all tasks are COMPLETED
        if all(t.status == TaskStatus.COMPLETED for t in tasks):
            return NextBestAction(
                action_title="Journey Completed",
                description="All identified municipal, legal, and benefit tasks for this life event have been completed.",
                target_task_id="complete",
                reasoning="The citizen journey has reached 100% completion.",
                urgency="Low",
                requires_approval=False
            )

        return None

next_best_action_agent = NextBestActionAgent()
