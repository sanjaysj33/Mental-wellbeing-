import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Mood {
    private int rating;
    private String date; // Simple date as string (e.g., "2025-10-09")
    private String note;

    public Mood(int rating, String date, String note) {
        this.rating = rating;
        this.date = date;
        this.note = note;
    }

    public int getRating() { return rating; }
    public String getDate() { return date; }
    public String getNote() { return note; }

    @Override
    public String toString() {
        return "Date: " + date + " | Mood Rating: " + rating + "/10 | Note: " + note;
    }
}

class TipDatabase {
    private static final List<String> tips = new ArrayList<>();

    static {
        tips.add("Feeling anxious? Try grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.");
        tips.add("Low energy? Take a 5-minute walk outside or stretch gently.");
        tips.add("Overwhelmed? Write down 3 things you're grateful for right now.");
        tips.add("Sad? Listen to your favorite uplifting song and dance along.");
        tips.add("Stressed? Close your eyes and imagine a peaceful place for 2 minutes.");
        tips.add("Irritable? Drink a glass of water and take 10 deep breaths.");
        tips.add("Lonely? Reach out to a friend with a quick message.");
        tips.add("Happy? Share your joytell someone about it!");
    }

    public static String getRandomTip() {
        if (tips.isEmpty()) return "No tips available.";
        int index = (int) (Math.random() * tips.size());
        return tips.get(index);
    }

    public static void printAllTips() {
        System.out.println("\nSelf-Care Tips:");
        for (int i = 0; i < tips.size(); i++) {
            System.out.println((i + 1) + ". " + tips.get(i));
        }
        System.out.println();
    }
}

class BreathingExercise {
    public static void guideBreathing() {
        System.out.println("\n=== Guided Breathing Exercise (4-7-8 Technique) ===");
        System.out.println("This helps calm your mind. Follow along:");
        System.out.println("1. Sit or lie comfortably. Close your eyes if you like.");
        
        try {
            Thread.sleep(2000); // Pause for effect
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("2. Inhale quietly through your nose for 4 seconds...");
        countDown(4);
        
        System.out.println("3. Hold your breath for 7 seconds...");
        countDown(7);
        
        System.out.println("4. Exhale completely through your mouth for 8 seconds, making a whoosh sound...");
        countDown(8);
        
        System.out.println("Repeat 3-4 times. How do you feel now? Take a moment.");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Exercise complete. Breathe easy! 33
");
    }

    private static void countDown(int seconds) {
        for (int i = seconds; i > 0; i--) {
            System.out.print(i + " ");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println();
    }
}

public class mentalwellbeing {
    private static List<Mood> moodHistory = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("🌟 Welcome to Mental Wellbeing App 🌟");
        System.out.println("This app helps track your mood and offers simple wellbeing tools.");
        System.out.println("Remember: You're not alone. Small steps make a big difference.\n");

        boolean running = true;
        while (running) {
            printMenu();
            int choice = getIntInput("Enter your choice (1-6): ");

            switch (choice) {
                case 1:
                    logMood();
                    break;
                case 2:
                    viewMoodHistory();
                    break;
                case 3:
                    System.out.println("Here's a random self-care tip: " + TipDatabase.getRandomTip());
                    break;
                case 4:
                    TipDatabase.printAllTips();
                    break;
                case 5:
                    BreathingExercise.guideBreathing();
                    break;
                case 6:
                    System.out.println("Take care! Prioritize your wellbeing. 49a");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.\n");
            }
        }
        scanner.close();
    }

    private static void printMenu() {
        System.out.println("\n--- Menu ---");
        System.out.println("1. Log today's mood");
        System.out.println("2. View mood history");
        System.out.println("3. Get a random self-care tip");
        System.out.println("4. View all self-care tips");
        System.out.println("5. Do a quick breathing exercise");
        System.out.println("6. Exit");
        System.out.println("------------\n");
    }

    private static void logMood() {
        System.out.print("Enter today's date (e.g., 2025-10-09): ");
        String date = scanner.nextLine();

        System.out.print("Rate your mood (1-10, 1=very low, 10=excellent): ");
        int rating = getIntInput("");

        System.out.print("Add a short note (optional, or press Enter to skip): ");
        String note = scanner.nextLine();

        Mood mood = new Mood(rating, date, note.isEmpty() ? "No note" : note);
        moodHistory.add(mood);
        System.out.println("\nMood logged! Your rating: " + rating + "/10. Great job checking in.\n");
    }

    private static void viewMoodHistory() {
        if (moodHistory.isEmpty()) {
            System.out.println("No moods logged yet. Start with option 1!\n");
            return;
        }

        System.out.println("\n--- Mood History ---");
        double avg = 0;
        for (Mood m : moodHistory) {
            System.out.println(m);
            avg += m.getRating();
        }
        avg /= moodHistory.size();
        System.out.printf("Average mood: %.1f/10\n", avg);
        System.out.println("-------------------\n");
    }

    private static int getIntInput(String prompt) {
        int value = 0;
        while (true) {
            System.out.print(prompt);
            try {
                value = Integer.parseInt(scanner.nextLine());
                if (value >= 1 && value <= 10 && !prompt.contains("choice")) {
                    // For mood rating validation
                    break;
                } else if (prompt.contains("choice")) {
                    // For menu choice validation, allow any integer
                    break;
                } else {
                    System.out.println("Please enter a number between 1 and 10.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number.");
            }
        }
        return value;
    }
}
