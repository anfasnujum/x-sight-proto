import { PanoramaBoard } from './birds/PanoramaBoard'
import { BirdEntitiesView } from './birds/BirdEntitiesView'
import { BirdTimelineLensView } from './birds/BirdTimelineLensView'
import { BirdEvidencesLensView } from './birds/BirdEvidencesLensView'
import { BirdNotesLensView } from './birds/BirdNotesLensView'
import { BirdTasksLensView } from './birds/BirdTasksLensView'
import { useForensicStore } from '../store/useForensicStore'

export function BirdsEyeView() {
  const lens = useForensicStore((s) => s.birdsEyeLens)

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0c0d10] p-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Bird&apos;s view
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Cross-case lenses — panorama board, entity dossiers, entity event
          timeline, and rolled-up workspace artifacts.
        </p>

        {lens === 'panorama' && <PanoramaBoard />}
        {lens === 'entities' && <BirdEntitiesView />}
        {lens === 'timeline' && <BirdTimelineLensView />}
        {lens === 'evidences' && <BirdEvidencesLensView />}
        {lens === 'notes' && <BirdNotesLensView />}
        {lens === 'tasks' && <BirdTasksLensView />}
      </div>
    </div>
  )
}
