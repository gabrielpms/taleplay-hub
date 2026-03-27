import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { Character } from "@/data/mockData";
import { cn } from "@/lib/utils";

const roleLabels: Record<Character["role"], string> = {
  protagonist: "Protagonista",
  antagonist: "Antagonista",
  supporting: "Coadjuvante",
  unknown: "Desconhecido",
};

const roleColors: Record<Character["role"], string> = {
  protagonist: "text-primary border-primary/40",
  antagonist: "text-red-400 border-red-400/40",
  supporting: "text-blue-400 border-blue-400/40",
  unknown: "text-muted-foreground border-border",
};

interface CharacterMentionProps {
  character: Character;
  isFirstMention: boolean;
}

export function CharacterMention({ character, isFirstMention }: CharacterMentionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<"top" | "bottom">("top");
  const spanRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setSide(rect.top > 200 ? "top" : "bottom");
    }
  }, [isOpen]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handlePopoverMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handlePopoverMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <span className="relative inline-block">
      <span
        ref={spanRef}
        className={cn(
          "cursor-pointer border-b transition-colors duration-200",
          isFirstMention
            ? "border-primary/50 text-primary/95 hover:border-primary hover:text-primary"
            : "border-foreground/20 hover:border-foreground/50"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen((v) => !v)}
      >
        {character.name}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: side === "top" ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 6 : -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 z-50 w-64",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-xl">
              {/* Arrow */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-border rotate-45",
                  side === "top"
                    ? "bottom-[-5px] border-b border-r"
                    : "top-[-5px] border-t border-l"
                )}
              />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-sm text-foreground truncate">
                      {character.name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-display font-medium px-1.5 py-0.5 rounded border flex-shrink-0",
                        roleColors[character.role]
                      )}
                    >
                      {roleLabels[character.role]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {character.description}
                  </p>
                  {character.traits && character.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {character.traits.map((trait) => (
                        <span
                          key={trait}
                          className="text-[10px] font-display px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// Parses a text string and returns React nodes with character mentions highlighted
export function parseTextWithCharacters(
  text: string,
  characters: Character[],
  shownCharacters: Set<string>
): React.ReactNode[] {
  if (!characters || characters.length === 0) return [text];

  const pattern = new RegExp(
    `\\b(${characters.map((c) => c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "g"
  );

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = pattern.exec(text)) !== null) {
    const matchedName = match[1];
    const character = characters.find((c) => c.name === matchedName);
    if (!character) continue;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const isFirst = !shownCharacters.has(character.id);
    if (isFirst) shownCharacters.add(character.id);

    parts.push(
      <CharacterMention
        key={`${character.id}-${keyCounter++}`}
        character={character}
        isFirstMention={isFirst}
      />
    );

    lastIndex = match.index + matchedName.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
