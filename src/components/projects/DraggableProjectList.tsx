"use client";

import { useState } from "react";
import { updateProjectOrder } from "@/app/actions/projectActions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableProjectItem({ project }: { project: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border ${
        isDragging
          ? "border-gray-400 dark:border-gray-500 shadow-2xl opacity-90 scale-[1.02]"
          : "border-gray-200 dark:border-gray-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
      } rounded-2xl group transition-all duration-200`}
    >
      {/* DRAG HANDLE */}
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-none"
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* PROJECT INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a href={`/dashboard/projects/${project.id}`} className="font-extrabold text-gray-900 dark:text-white truncate hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 decoration-2 transition-all">
            {project.title}
          </a>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md shrink-0">
            {project.industry || "Project"}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {project.short_description || "No description provided."}
        </p>
      </div>

      {/* QUICK EDIT LINK */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <a
          href={`/dashboard/projects/${project.id}`}
          className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Edit
        </a>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DraggableProjectList({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      // 1. Optimistic UI — instantly reorder on screen
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);

      // 2. Build the payload with new rank numbers
      const payload = newOrder.map((proj, index) => ({
        id: proj.id,
        sort_order: index,
      }));

      // 3. Persist to Supabase
      setIsSaving(true);
      await updateProjectOrder(payload);
      setIsSaving(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-4xl">
        <p className="text-gray-500 dark:text-gray-400 font-medium">You haven&apos;t added any projects yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Projects</h2>
        {isSaving && (
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400 animate-pulse bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
            Saving layout...
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {projects.map((project) => (
              <SortableProjectItem key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
