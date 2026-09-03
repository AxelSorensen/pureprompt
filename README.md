# ✨ PurePrompt

A tool for testing prompt robustness by auto-generating test cases and evaluating a prompt's responses across models.

## Features

- 📝 **Prompt templates** — write prompts with `{{variable}}` placeholders, auto-recognized and highlighted in the editor
- 🧪 **Test case generation** — the Generate page produces diverse test cases automatically, with token limits and support for importing predefined examples
- 📊 **Evaluation** — the Evaluate page runs generated test cases across selected AI models and lets you rate responses to surface bias or failure modes
- 🤖 **Multi-model support** — built on LangChain with Anthropic and Hugging Face integrations

## Installation

```bash
git clone <this repo>
cd pureprompt
npm install
```

## Usage

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). A hosted version also runs at pureprompt.vercel.app.

## Built with

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [LangChain](https://js.langchain.com/) + [@langchain/anthropic](https://www.npmjs.com/package/@langchain/anthropic)
- [Hugging Face Inference](https://huggingface.co/docs/api-inference/index)
- [Tailwind CSS](https://tailwindcss.com/)

## Status

🚧 Inactive prototype — last touched in 2024; functional core (prompt/generate/evaluate flow) but not under active development.
