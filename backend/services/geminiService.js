// services/geminiService.js — Google Gemini AI integration with function calling
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * All tools available to the Gemini model.
 * The model chooses which function to call based on user intent.
 */
const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'createExpense',
        description: 'Creates a new expense. Call when the user says they spent money on something.',
        parameters: {
          type: 'OBJECT',
          properties: {
            amount: { type: 'NUMBER', description: 'Amount spent in dollars' },
            category: { type: 'STRING', description: 'Category (Food, Transport, Entertainment, etc.)' },
            merchant: { type: 'STRING', description: 'Where they spent it (Starbucks, Uber, etc.)' },
            date: { type: 'STRING', description: 'Date in YYYY-MM-DD format. Use today if not specified.' },
            description: { type: 'STRING', description: 'Short description of the expense' },
            payment_method: { type: 'STRING', description: 'Payment method: card, cash, etc.' },
          },
          required: ['amount', 'category', 'merchant', 'date'],
        },
      },
      {
        name: 'readExpenses',
        description: 'Reads all expenses for the user. Use when they ask how much they spent.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'updateExpense',
        description: 'Updates the most recent expense. Use when user says "actually make that..." or "change my last..."',
        parameters: {
          type: 'OBJECT',
          properties: {
            amount: { type: 'NUMBER', description: 'New amount' },
            category: { type: 'STRING', description: 'New category' },
            merchant: { type: 'STRING', description: 'New merchant' },
          },
          required: [],
        },
      },
      {
        name: 'deleteExpense',
        description: 'Deletes the most recent expense. Use when user says "remove my last expense".',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'generateInsights',
        description: 'Generates financial insights. Use when user asks how to save money or for financial advice.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'detectAnomaly',
        description: 'Detects unusual spending. Use when user asks about unusual or abnormal spending.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'predictSpending',
        description: 'Predicts monthly spending. Use when user asks for a forecast or budget prediction.',
        parameters: { type: 'OBJECT', properties: {} },
      },
    ],
  },
];

/**
 * Send a message to Gemini with conversation history and tool access.
 */
const sendMessage = async (prompt, history = []) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are an AI Finance Copilot — an intelligent financial advisor. Help users track expenses, manage budgets, get insights, and make smart financial decisions. Use the provided tools to interact with their financial data. Always be concise, helpful, and encouraging. Today is ${new Date().toISOString().split('T')[0]}. Reply in markdown.`,
  });

  const chat = model.startChat({ history, tools: TOOLS });
  const result = await chat.sendMessage(prompt);
  const calls = result.response.functionCalls();
  return { response: result.response, calls: calls || [], history: await chat.getHistory() };
};

module.exports = { sendMessage };
