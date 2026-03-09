// controllers/chatController.js — AI Copilot chat with Gemini tool calling
const { sendMessage } = require('../services/geminiService');
const expenseAgent = require('../ai-agents/expenseAgent');
const insightAgent = require('../ai-agents/insightAgent');
const predictionAgent = require('../ai-agents/predictionAgent');
const { detectAnomalies } = require('../services/anomalyService');
const { getBudgetStatus } = require('../ai-agents/budgetAgent');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Execute the tool function that Gemini selected based on user intent.
 */
const executeTool = async (toolName, args, userId) => {
  switch (toolName) {
    case 'createExpense':
      return await expenseAgent.createExpense(userId, args);
    case 'readExpenses':
      return await expenseAgent.readExpenses(userId);
    case 'updateExpense':
      return await expenseAgent.updateExpense(userId, args);
    case 'deleteExpense':
      return await expenseAgent.deleteExpense(userId);
    case 'generateInsights':
      return await insightAgent.generateInsights(userId);
    case 'predictSpending':
      return await predictionAgent.getPrediction(userId);
    case 'detectAnomaly':
      return await detectAnomalies(userId);
    default:
      return null;
  }
};

const chat = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const userId = req.user.userId;

    // First call: send user message and get response + potential tool call
    const { response, calls, history: newHistory } = await sendMessage(prompt, history);

    let finalText = response.text();

    // If Gemini selected a tool, execute it and send results back
    if (calls.length > 0) {
      const call = calls[0];
      const toolResult = await executeTool(call.name, call.args, userId);

      if (toolResult !== null) {
        // Build a follow-up model that mirrors the same config
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: `You are an AI Finance Copilot. Today is ${new Date().toISOString().split('T')[0]}. Reply in markdown.`,
        });

        const TOOLS = [{ functionDeclarations: require('../services/geminiService').TOOLS?.[0]?.functionDeclarations || [] }];
        const followUpChat = model.startChat({ history: newHistory });
        const followUp = await followUpChat.sendMessage([{
          functionResponse: { name: call.name, response: toolResult }
        }]);
        finalText = followUp.response.text();
      }
    }

    res.json({ response: finalText, history: newHistory });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'AI chat failed' });
  }
};

module.exports = { chat };
