// Import necessary modules for input and date/time handling
const readline = require('readline');

// Create an interface for reading user input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt the user for their name with error handling
function getUserName() {
    return new Promise((resolve) => {
        const askName = () => {
            // Prompt the user for their name
            rl.question("Please enter your name: ", (name) => {
                name = name.trim(); // Remove leading/trailing whitespace

                // Check if the input is not empty
                if (name) {
                    resolve(name); // Return the valid name
                } else {
                    console.log("Error: Name cannot be empty. Please try again.");
                    askName(); // Ask again if the input is invalid
                }
            });
        };
        askName(); // Start the prompting process
    });
}

// Main function to execute the program
async function main() {
    try {
        // Step 1: Print "Hello, World!" to the console
        console.log("Hello, World!");

        // Step 2: Ask for the user's name and store it
        const userName = await getUserName();

        // Step 3: Greet the user by name
        console.log(`Hello, ${userName}! Welcome to the program.`);

        // Step 4: Print the current date and time
        const currentDateTime = new Date(); // Get the current date and time
        const formattedDateTime = currentDateTime.toLocaleString(); // Format as a readable string
        console.log(`The current date and time is: ${formattedDateTime}`);
    } catch (error) {
        // Handle any unexpected errors gracefully
        console.error(`An error occurred in the program: ${error.message}`);
    } finally {
        // Close the readline interface to exit the program cleanly
        rl.close();
    }
}

// Run the program by calling the main function
main();