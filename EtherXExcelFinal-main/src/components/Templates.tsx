import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import {
  Wallet,
  GraduationCap,
  Dumbbell,
  Calendar,
  ShoppingCart,
  Music,
  Flame,
  Heart,
} from "lucide-react";

interface TemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: string) => void;
}

const TEMPLATES = [
  {
    id: "budget",
    title: "Budget Tracker 💰",
    description: "Track your income, expenses, and savings goals",
    icon: Wallet,
    color: "from-green-400 to-emerald-600",
  },
  {
    id: "study",
    title: "Study Schedule 📚",
    description: "Organize classes, assignments, and exam prep",
    icon: GraduationCap,
    color: "from-blue-400 to-indigo-600",
  },
  {
    id: "workout",
    title: "Workout Planner 💪",
    description: "Plan exercises, track reps, and monitor progress",
    icon: Dumbbell,
    color: "from-orange-400 to-red-600",
  },
  {
    id: "meal",
    title: "Meal Prep 🍱",
    description: "Weekly meal plans with grocery lists and recipes",
    icon: ShoppingCart,
    color: "from-pink-400 to-rose-600",
  },
  {
    id: "habit",
    title: "Habit Tracker ⚡",
    description: "Build streaks and track daily habits",
    icon: Flame,
    color: "from-yellow-400 to-orange-600",
  },
  {
    id: "social",
    title: "Content Calendar 📱",
    description: "Plan social media posts and content ideas",
    icon: Calendar,
    color: "from-purple-400 to-violet-600",
  },
  {
    id: "playlist",
    title: "Playlist Tracker 🎵",
    description: "Organize songs, artists, and music moods",
    icon: Music,
    color: "from-cyan-400 to-blue-600",
  },
  {
    id: "selfcare",
    title: "Self-Care Log 💖",
    description: "Track mood, mental health, and wellness activities",
    icon: Heart,
    color: "from-pink-400 to-purple-600",
  },
];

export function Templates({ open, onClose, onSelect }: TemplatesProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-made template designed for Gen Z lifestyle
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {TEMPLATES.map((template, index) => (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                onSelect(template.id);
                onClose();
              }}
              className="text-left p-4 rounded-lg border-2 border-border hover:border-primary transition-all group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <template.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function generateTemplate(type: string): Map<string, any> {
  const cells = new Map();

  switch (type) {
    case "budget":
      cells.set("A1", { value: "💰 Monthly Budget", bold: true, backgroundColor: "#10b981", color: "#ffffff" });
      cells.set("A3", { value: "Income", bold: true });
      cells.set("B3", { value: "Amount", bold: true });
      cells.set("A4", { value: "Salary" });
      cells.set("B4", { value: "0" });
      cells.set("A5", { value: "Side Hustle" });
      cells.set("B5", { value: "0" });
      cells.set("A6", { value: "Other" });
      cells.set("B6", { value: "0" });
      cells.set("A7", { value: "Total Income", bold: true });
      cells.set("B7", { value: "=SUM(B4:B6)", formula: "=SUM(B4:B6)", bold: true });
      
      cells.set("A9", { value: "Expenses", bold: true });
      cells.set("B9", { value: "Amount", bold: true });
      cells.set("A10", { value: "Rent" });
      cells.set("B10", { value: "0" });
      cells.set("A11", { value: "Food" });
      cells.set("B11", { value: "0" });
      cells.set("A12", { value: "Transport" });
      cells.set("B12", { value: "0" });
      cells.set("A13", { value: "Entertainment" });
      cells.set("B13", { value: "0" });
      cells.set("A14", { value: "Shopping" });
      cells.set("B14", { value: "0" });
      cells.set("A15", { value: "Total Expenses", bold: true });
      cells.set("B15", { value: "=SUM(B10:B14)", formula: "=SUM(B10:B14)", bold: true });
      
      cells.set("A17", { value: "Savings", bold: true, backgroundColor: "#dbeafe" });
      cells.set("B17", { value: "=B7-B15", formula: "=B7-B15", bold: true, backgroundColor: "#dbeafe" });
      break;

    case "study":
      cells.set("A1", { value: "📚 Study Schedule", bold: true, backgroundColor: "#3b82f6", color: "#ffffff" });
      cells.set("A3", { value: "Day", bold: true });
      cells.set("B3", { value: "Subject", bold: true });
      cells.set("C3", { value: "Time", bold: true });
      cells.set("D3", { value: "Status", bold: true });
      
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const subjects = ["Math", "Science", "English", "History", "Art"];
      
      days.forEach((day, i) => {
        cells.set(`A${i + 4}`, { value: day });
        cells.set(`B${i + 4}`, { value: subjects[i] });
        cells.set(`C${i + 4}`, { value: "2 hours" });
        cells.set(`D${i + 4}`, { value: "⏳" });
      });
      break;

    case "workout":
      cells.set("A1", { value: "💪 Workout Planner", bold: true, backgroundColor: "#ef4444", color: "#ffffff" });
      cells.set("A3", { value: "Exercise", bold: true });
      cells.set("B3", { value: "Sets", bold: true });
      cells.set("C3", { value: "Reps", bold: true });
      cells.set("D3", { value: "Done", bold: true });
      
      const exercises = ["Push-ups", "Squats", "Planks", "Lunges", "Burpees"];
      exercises.forEach((exercise, i) => {
        cells.set(`A${i + 4}`, { value: exercise });
        cells.set(`B${i + 4}`, { value: "3" });
        cells.set(`C${i + 4}`, { value: "12" });
        cells.set(`D${i + 4}`, { value: "☐" });
      });
      break;

    case "meal":
      cells.set("A1", { value: "🍱 Meal Prep", bold: true, backgroundColor: "#ec4899", color: "#ffffff" });
      cells.set("A3", { value: "Day", bold: true });
      cells.set("B3", { value: "Breakfast", bold: true });
      cells.set("C3", { value: "Lunch", bold: true });
      cells.set("D3", { value: "Dinner", bold: true });
      
      const mealDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      mealDays.forEach((day, i) => {
        cells.set(`A${i + 4}`, { value: day });
      });
      break;

    case "habit":
      cells.set("A1", { value: "⚡ Habit Tracker", bold: true, backgroundColor: "#f59e0b", color: "#ffffff" });
      cells.set("A3", { value: "Habit", bold: true });
      
      for (let i = 1; i <= 7; i++) {
        cells.set(`${String.fromCharCode(65 + i)}3`, { value: `Day ${i}`, bold: true });
      }
      
      const habits = ["Drink Water 💧", "Exercise 🏃", "Read 📖", "Meditate 🧘", "Sleep 8hrs 😴"];
      habits.forEach((habit, i) => {
        cells.set(`A${i + 4}`, { value: habit });
        for (let j = 1; j <= 7; j++) {
          cells.set(`${String.fromCharCode(65 + j)}${i + 4}`, { value: "☐" });
        }
      });
      break;

    case "social":
      cells.set("A1", { value: "📱 Content Calendar", bold: true, backgroundColor: "#8b5cf6", color: "#ffffff" });
      cells.set("A3", { value: "Date", bold: true });
      cells.set("B3", { value: "Platform", bold: true });
      cells.set("C3", { value: "Content Idea", bold: true });
      cells.set("D3", { value: "Status", bold: true });
      
      const platforms = ["Instagram", "TikTok", "Twitter", "YouTube", "LinkedIn"];
      platforms.forEach((platform, i) => {
        cells.set(`B${i + 4}`, { value: platform });
        cells.set(`D${i + 4}`, { value: "📝 Draft" });
      });
      break;

    case "playlist":
      cells.set("A1", { value: "🎵 Playlist Tracker", bold: true, backgroundColor: "#06b6d4", color: "#ffffff" });
      cells.set("A3", { value: "Song", bold: true });
      cells.set("B3", { value: "Artist", bold: true });
      cells.set("C3", { value: "Mood", bold: true });
      cells.set("D3", { value: "Rating", bold: true });
      break;

    case "selfcare":
      cells.set("A1", { value: "💖 Self-Care Log", bold: true, backgroundColor: "#a855f7", color: "#ffffff" });
      cells.set("A3", { value: "Date", bold: true });
      cells.set("B3", { value: "Mood", bold: true });
      cells.set("C3", { value: "Activity", bold: true });
      cells.set("D3", { value: "Notes", bold: true });
      
      const moods = ["😊 Great", "🙂 Good", "😐 Okay", "😔 Low", "😌 Calm"];
      moods.forEach((mood, i) => {
        cells.set(`B${i + 4}`, { value: mood });
      });
      break;
  }

  return cells;
}