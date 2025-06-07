import type { CoreMessage } from "ai"
import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Placeholder for your Controla.eu API Key
// IMPORTANT: Replace with your actual API key or set it as an environment variable
const CONTROLA_API_KEY = process.env.CONTROLA_API_KEY || "YOUR_CONTROLA_API_KEY_HERE"
const BASE_API_URL = "https://agent-controla-eu.vercel.app/api"

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()
  const lastUserMessage = messages[messages.length - 1]?.content

  if (!lastUserMessage) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 })
  }

  // Simulate a user ID for the demo
  const userId = 1

  try {
    // Step 1: Detect message type
    const detectorResponse = await fetch(`${BASE_API_URL}/message-type-detector`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONTROLA_API_KEY}`,
      },
      body: JSON.stringify({ text: lastUserMessage, userId }),
    })

    if (!detectorResponse.ok) {
      const errorData = await detectorResponse.json()
      console.error("Detector API Error:", errorData)
      return NextResponse.json(
        { error: "Failed to detect message type", details: errorData },
        { status: detectorResponse.status },
      )
    }

    const detectorResult = await detectorResponse.json()
    const suggestedRoute = detectorResult.suggested_route
    const detectedTypes = detectorResult.detected_types || []

    let agentResponseData: any = null
    const responseType = "text_response" // Default response type

    // Handle specific demo steps first
    if (lastUserMessage === "Demonstração") {
      agentResponseData = { type: "how_it_works_step1" }
    } else if (lastUserMessage === "Continuar" && messages.length === 2) {
      // After initial demo button
      agentResponseData = { type: "how_it_works_step2" }
    } else if (lastUserMessage === "Reiniciar Demonstração") {
      agentResponseData = { type: "landing_page" }
    }
    // Handle specific messages for the "Como Funciona" flow
    else if (lastUserMessage === "camisa 110") {
      agentResponseData = {
        type: "expense_added",
        data: {
          description: "CAMISA",
          amount: 110.0,
          date: "07/06/2025",
          category: "Vestuário",
          id: "654/1-2",
          reminder: "Você está quase chegando no seu limite definido de R$ 165 por mês com Vestuário.",
        },
      }
    } else if (lastUserMessage === "quanto eu gastei nos últimos dias?") {
      agentResponseData = {
        type: "report_summary",
        data: {
          period: "Últimos 7 dias",
          balance: { income: 0, expenses: 632.0, net: -632.0, savings_rate: 0 },
          top_categories: [
            { name: "Alimentação", amount: 146.0, percentage: 23.0, transactions: 3 },
            { name: "Transporte", amount: 229.0, percentage: 36.0, transactions: 2 },
            { name: "Lazer", amount: 87.0, percentage: 14.0, transactions: 1 },
            { name: "Contas Fixas", amount: 103.0, percentage: 16.0, transactions: 1 },
            { name: "Jantar fora", amount: 67.0, percentage: 11.0, transactions: 1 },
          ],
          insights: ["Seus gastos aumentaram em 20% essa semana"],
          whatsapp_text:
            "📊 *RESUMO FINANCEIRO*\n📅 Período: *Últimos 7 dias*\n\n💰 *BALANÇO GERAL*\n📈 Receitas: *R$ 0,00*\n📉 Despesas: *R$ 632,00*\n💵 Saldo: *R$ -632,00*\n📊 Taxa de economia: *0%*",
        },
      }
    } else if (lastUserMessage.includes("quero juntar 200000 para casa própria até 2027")) {
      // This is a mixed message, simulate multiple responses
      agentResponseData = [
        {
          type: "expense_added",
          data: { description: "lanches", amount: 100.0, date: "07/06/2025", category: "Alimentação", id: "654/1-2" },
        },
        {
          type: "expense_added",
          data: {
            description: "gasolina no carro",
            amount: 150.0,
            date: "07/06/2025",
            category: "Alimentação",
            id: "655/2-2",
          },
        },
        {
          type: "income_added",
          data: {
            description: "serviço pessoal",
            amount: 300.0,
            date: "07/06/2025",
            category: "Freelance / Prestação de Serviços",
            id: "423/10-2",
          },
        },
        {
          type: "goal_added",
          data: {
            description: "casa própria",
            totalValue: 200000.0,
            progress: 20.0,
            targetDate: "2027",
            observation: null,
            id: "167-1",
          },
        },
        {
          type: "text_response",
          content: "Lembrete para acordar amanhã 9hs adicionado.",
        },
      ]
    } else if (lastUserMessage.includes("preciso de uma meta pra juntar 111 mil para trocar moto")) {
      agentResponseData = [
        {
          type: "goal_added",
          data: {
            description: "trocar moto",
            totalValue: 111000.0,
            progress: 4.0,
            targetDate: "07/12/2025",
            observation: "Como você não definiu uma data para essa meta, definimos ela para daqui 6 meses.",
            id: "168-2",
          },
        },
        {
          type: "income_added",
          data: {
            description: "2% da meta (Alocação para Meta)",
            amount: 2220.0,
            date: "07/06/2025",
            category: "Alocação para Meta",
            id: "422/5-2",
          },
        },
      ]
    }
    // If not a specific demo message, proceed with API calls
    else if (suggestedRoute) {
      const processorResponse = await fetch(`${BASE_API_URL}${suggestedRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONTROLA_API_KEY}`,
        },
        body: JSON.stringify({ text: lastUserMessage, userId }),
      })

      if (!processorResponse.ok) {
        const errorData = await processorResponse.json()
        console.error("Processor API Error:", errorData)
        return NextResponse.json(
          { error: `Failed to process message with ${suggestedRoute}`, details: errorData },
          { status: processorResponse.status },
        )
      }

      const processorResult = await processorResponse.json()

      // Format the response based on the detected type
      if (detectedTypes.includes("FINANCIAL") && processorResult.results && processorResult.results.length > 0) {
        agentResponseData = processorResult.results.map((res: any) => ({
          type: res.tipo === "despesa" ? "expense_added" : "income_added",
          data: {
            description: res.data.name || res.data.description,
            amount: res.data.amount,
            date: new Date(res.data.expense_date || res.data.income_date).toLocaleDateString("pt-BR"),
            category: res.data.category_id ? (res.data.category_id === 5 ? "Contas" : "Geral") : "Desconhecida", // Placeholder for category mapping
            id: res.data.id,
            reminder: res.data.reminder || null, // Assuming reminder might come from API
          },
        }))
      } else if (detectedTypes.includes("MONTHLY_GOALS") || detectedTypes.includes("GOALS")) {
        agentResponseData = {
          type: "goal_added",
          data: {
            description: processorResult.data.description,
            monthlyValue: processorResult.data.monthlyValue,
            totalValue: processorResult.data.totalValue,
            targetDate: processorResult.data.targetDate,
            months: processorResult.data.months,
            category: processorResult.data.category,
            progress: processorResult.data.progress || 0, // Assuming progress might be in response
            observation: processorResult.data.observation || null,
            id: processorResult.data.id || Math.floor(Math.random() * 1000), // Placeholder ID
          },
        }
      } else if (detectedTypes.includes("REPORTS") && processorResult.report) {
        agentResponseData = {
          type: "report_summary",
          data: {
            period: processorResult.report.period,
            balance: processorResult.report.data.balance,
            top_categories: processorResult.report.data.top_categories,
            insights: processorResult.report.data.insights,
            whatsapp_text: processorResult.whatsapp, // Use the pre-formatted whatsapp text if available
          },
        }
      } else {
        // Fallback for other types or if no specific formatting is needed
        agentResponseData = {
          type: "text_response",
          content: processorResult.recommendation || JSON.stringify(processorResult, null, 2),
        }
      }
    } else {
      agentResponseData = {
        type: "text_response",
        content:
          detectorResult.recommendation ||
          "Não consegui identificar o tipo da sua mensagem. Por favor, tente novamente.",
      }
    }

    // If agentResponseData is an array (for mixed messages), send each as a separate message
    if (Array.isArray(agentResponseData)) {
      const formattedResponses = agentResponseData.map((data) => ({
        role: "assistant",
        content: JSON.stringify(data),
      }))
      return new Response(JSON.stringify({ messages: formattedResponses }), {
        headers: { "Content-Type": "application/json" },
      })
    } else {
      return new Response(
        JSON.stringify({ messages: [{ role: "assistant", content: JSON.stringify(agentResponseData) }] }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
