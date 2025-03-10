**AI-Assisted Hello World**
Language Choice
I chose JavaScript because it is a versatile and widely-used language that runs both on the client-side and server-side (using Node.js). Its asynchronous capabilities, combined with its rich ecosystem of libraries and tools, make it an excellent choice for building interactive applications like this one. Additionally, JavaScript's simplicity and readability allow for quick prototyping and experimentation.

**AI Tool Used**
I used ChatGPT to assist with coding. The AI provided step-by-step guidance in writing the code, offering suggestions for structuring the program, handling user input, validating data, and formatting output. It also helped me understand how to use Node.js modules like readline for user interaction.

**The AI Experience**
Here's how I used the AI tool and what I discovered:

**What worked well:**
Clear and structured guidance: ChatGPT broke down the problem into manageable steps, such as creating the readline interface, prompting the user for input, and displaying the current date and time. This made it easy to follow along and implement the program incrementally.
Error handling suggestions: The AI recommended adding error handling for user input (e.g., ensuring the name isn't empty) and gracefully closing the readline interface in the finally block to prevent resource leaks. These suggestions improved the robustness of the program.
Code formatting and readability: The AI consistently formatted the code in a clean and readable way, using modern JavaScript practices like async/await and Promise for better structure.
What didn't work well:
Overly verbose explanations: At times, the AI provided more detail than necessary, which could be overwhelming for beginners. For example, some explanations about promises and asynchronous functions were repetitive and could have been condensed.
Lack of context-specific optimizations: While the AI-generated code was functional, it didn't always suggest the most concise or idiomatic JavaScript solutions. For instance, the recursive askName function could have been simplified using a loop instead.
Modifications I made:
Simplified input validation: I streamlined the logic for checking if the user's name was empty by directly resolving the promise when valid input was received. This made the code easier to follow.
Improved date formatting: Although the AI suggested using toLocaleString() for formatting the date, I considered adding additional options (e.g., specifying locales or formats) to make the output more customizable.
Added comments: To enhance clarity, I added detailed inline comments explaining each section of the code, making it easier for others to understand the program's functionality.

**Screenshot**
![alt text](<Screenshot 2025-03-10 212621.png>)