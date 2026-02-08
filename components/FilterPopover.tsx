import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FilterState {
    status: ("todo" | "done")[];
    difficulty: ("easy" | "medium" | "hard")[];
    platform: string[];
}

interface FilterPopoverProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function FilterPopover({ filters, onFilterChange }: FilterPopoverProps) {
    const toggleStatus = (status: "todo" | "done") => {
        const newStatus = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onFilterChange({ ...filters, status: newStatus });
    };

    const toggleDifficulty = (diff: "easy" | "medium" | "hard") => {
        const newDiff = filters.difficulty.includes(diff)
            ? filters.difficulty.filter(d => d !== diff)
            : [...filters.difficulty, diff];
        onFilterChange({ ...filters, difficulty: newDiff });
    };

    const togglePlatform = (platform: string) => {
        const newPlatform = filters.platform.includes(platform)
            ? filters.platform.filter(p => p !== platform)
            : [...filters.platform, platform];
        onFilterChange({ ...filters, platform: newPlatform });
    };

    const activeCount = filters.status.length + filters.difficulty.length + filters.platform.length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "h-11 w-11 border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all relative",
                        activeCount > 0 && "text-amber-500 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
                    )}
                >
                    <Filter size={16} strokeWidth={2.5} />
                    {activeCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black border border-[#09090b]">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-[#09090b] border-zinc-800 rounded-xl shadow-2xl" align="end">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status-done"
                                    checked={filters.status.includes('done')}
                                    onCheckedChange={() => toggleStatus('done')}
                                    className="border-zinc-700 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                                <Label htmlFor="status-done" className="text-zinc-300 text-xs font-medium cursor-pointer">Solved</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status-todo"
                                    checked={filters.status.includes('todo')}
                                    onCheckedChange={() => toggleStatus('todo')}
                                    className="border-zinc-700 data-[state=checked]:bg-zinc-600 data-[state=checked]:border-zinc-600"
                                />
                                <Label htmlFor="status-todo" className="text-zinc-300 text-xs font-medium cursor-pointer">Unsolved</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Difficulty</h4>
                        <div className="flex flex-col gap-2">
                            {['easy', 'medium', 'hard'].map((diff) => (
                                <div key={diff} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`diff-${diff}`}
                                        checked={filters.difficulty.includes(diff as "easy" | "medium" | "hard")}
                                        onCheckedChange={() => toggleDifficulty(diff as "easy" | "medium" | "hard")}
                                        className={cn(
                                            "border-zinc-700",
                                            diff === 'easy' && "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
                                            diff === 'medium' && "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
                                            diff === 'hard' && "data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500",
                                        )}
                                    />
                                    <Label htmlFor={`diff-${diff}`} className="text-zinc-300 text-xs font-medium cursor-pointer capitalize">{diff}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform</h4>
                        <div className="flex flex-col gap-2">
                            {['LeetCode', 'GeeksforGeeks', 'InterviewBit', 'CodeStudio'].map((platform) => (
                                <div key={platform} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`platform-${platform}`}
                                        checked={filters.platform.includes(platform)}
                                        onCheckedChange={() => togglePlatform(platform)}
                                        className="border-zinc-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <Label htmlFor={`platform-${platform}`} className="text-zinc-300 text-xs font-medium cursor-pointer">{platform}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(activeCount > 0) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onFilterChange({ status: [], difficulty: [], platform: [] })}
                            className="w-full text-[10px] h-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
