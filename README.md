# PurePrompt - An easy tool for prompt robustness and eval augmentation

PurePrompt is an advanced tool for optimizing AI prompt engineering through its three key components: Prompt, Generate, and Evaluate. The Generate page automatically produces diverse test cases, allowing users to control token limits and import predefined examples. The Evaluate page runs these test cases across selected AI models to assess prompt robustness, with users rating responses to identify issues. This tool enhances efficiency in prompt testing, improves AI safety by detecting biases, and helps refine model performance. Future plans include beta-testing, expanding model support, and enhancing prompt customization features.

## Setup

No need to install, just head over to https://pureprompt.vercel.app/ and get started!

## Highlights
- **Create and Refine Prompt Templates**: Set up prompt templates with placeholder variables for user content, enabling efficient experimentation and optimization of instructions.
- **Automatic Variable Recognition**: Recognizes and highlights variables denoted by `{{variable}}` in the input text for easy management and iteration.
  
<p align="center">
<img src="https://github.com/AxelSorensen/pureprompt/blob/master/images/prompt_screen.png" width="600">
</p>

- **Generate Diverse Test Cases**: Automatically produces a wide range of test cases based on the context of the prompt and user-defined instructions.
- **Control Token Limits**: Adjusts the average number of tokens per test case for better management of test case size and complexity.
  
<p align="center">
<img src="https://github.com/AxelSorensen/pureprompt/blob/master/images/generate_test_case.png" width="600">
</p>

- **Import Predefined Examples**: Allows easy import of predefined test cases to replicate or build upon existing examples.
- **Parallel Model Testing**: Runs test cases through selected AI models in parallel to quickly assess prompt robustness.
  
<p align="center">
<img src="https://github.com/AxelSorensen/pureprompt/blob/master/images/test_cases.png" width="600">
</p>

- **Rate Model Responses**: Provides a rating system (1-5 scale) for evaluating model responses to identify areas of strength and weakness.
- **AI Safety Enhancement**: Helps detect and address issues that could lead to harmful or biased responses, improving the ethical use of AI.
- **Evaluation Augmentation**: Simplifies the process of generating and evaluating diverse test cases to spot model limitations or deceptive behaviors.
  
<p align="center">
<img src="https://github.com/AxelSorensen/pureprompt/blob/master/images/evaluate robustness.png" width="600">
</p>

- **User-Friendly for Newcomers**: Aims to make prompt engineering and testing accessible, even for those new to the field.
- **User Experience Focus**: Browser-based tool with a user-friendly interface designed for both ease of use and developer efficiency.

## Tutorial

Nothing beats a video tutorial to learn the ropes: [embed]

## Reach out

I build custom tools to advance the field of AI safety. I'm always interested in new projects so feel free to reach out at:
https://www.linkedin.com/in/axel-sorensen/
