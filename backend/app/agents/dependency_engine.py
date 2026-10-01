from typing import List, Dict, Tuple
from app.models.schemas import TaskItem, TaskStatus

class DependencyEngine:
    def evaluate_graph(self, tasks: List[TaskItem]) -> Tuple[List[TaskItem], int]:
        task_map: Dict[str, TaskItem] = {t.task_id: t for t in tasks}
        
        updated_tasks: List[TaskItem] = []
        for t in tasks:
            # If task is COMPLETED or IN_PROGRESS or NEEDS_REVIEW or BLOCKED, preserve its status unless unlocked
            if t.status in [TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS, TaskStatus.NEEDS_REVIEW, TaskStatus.BLOCKED]:
                updated_tasks.append(t)
                continue
                
            # Check dependencies
            if not t.dependencies:
                if t.status == TaskStatus.LOCKED:
                    t.status = TaskStatus.READY
            else:
                all_completed = True
                for dep_id in t.dependencies:
                    dep_task = task_map.get(dep_id)
                    if not dep_task or dep_task.status != TaskStatus.COMPLETED:
                        all_completed = False
                        break
                
                if all_completed:
                    if t.status == TaskStatus.LOCKED:
                        t.status = TaskStatus.READY
                else:
                    if t.status == TaskStatus.READY:
                        t.status = TaskStatus.LOCKED

            updated_tasks.append(t)

        completed_count = sum(1 for t in updated_tasks if t.status == TaskStatus.COMPLETED)
        total_count = len(updated_tasks)
        progress = int((completed_count / total_count) * 100) if total_count > 0 else 0

        return updated_tasks, progress

dependency_engine = DependencyEngine()
