import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ZoomControl } from "./right/ZoomControl";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};


function Divider() {
  return (
    <div className="h-px bg-white/10 mx-2" />
  );
}

export function RightHud({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="fixed right-4 bottom-[var(--bottom-bar-height)] z-10">
      <Collapsible.Root defaultOpen>
        <div className="flex flex-col items-start">

          {/* CONTENT */}
        
        <Collapsible.Content
            forceMount
            className="
                overflow-hidden
                transition-[height,opacity]
                duration-200
                ease-out
                h-[var(--radix-collapsible-content-height)]
                data-[state=closed]:h-0
                data-[state=open]:opacity-100
                data-[state=closed]:opacity-0
            "
            >

            <div
                className="
                min-w-[180px]
                bg-neutral-700/70
                backdrop-blur
                text-white
                rounded-t-md
                border border-sky-500/20
                shadow-lg
                "
            >
                <ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
                <Divider />

            </div>
        </Collapsible.Content>

          {/* TOGGLE */}
          <Collapsible.Trigger asChild>
            <button
              className="
              w-full h-8 
              flex items-center justify-center 
              bg-neutral-800/70 
              backdrop-blur-sm
              text-white
              border border-t border-sky-500/20 
              shadow-md
              "
              >

              <ChevronUp className="data-[state=open]:hidden min-w-[89px]" />
              <ChevronDown className="data-[state=closed]:hidden min-w-[89px]" />
            </button>
          </Collapsible.Trigger>

        </div>
      </Collapsible.Root>
    </div>
  );
}