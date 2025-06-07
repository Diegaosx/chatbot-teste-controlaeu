"use client"

import type React from "react"

import { cn } from "../lib/utils.js"
import { useChat } from "ai/react"
import { useState, useEffect, useRef } from "react"

import {
  ArrowUpIcon,
  CheckCircle2Icon,
  GoalIcon,
  ReceiptTextIcon,
  WalletIcon,
  CalendarDaysIcon,
  BarChart3Icon,
  LightbulbIcon,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input" // Re-introducing Input for the "Como Funciona" step 1
import { Card, CardContent, CardTitle } from "./ui/card" // For structured messages
import { FinancialCharts } from "./financial-charts" // Import the new component

// Define message types for pre-defined buttons
type ExampleMessage = {
  id: string
  text: string
  type: "initial" | "expense_input" | "report_input" | "mixed_input" | "goal_input" | "continue"
  nextStep?: string // For sequential flow
}

const initialExampleMessages: ExampleMessage[] = [
  { id: "start_demo", text: "Demonstração", type: "initial", nextStep: "step1_expense_input" },
]

const step1ExampleMessages: ExampleMessage[] = [
  { id: "expense_example", text: "camisa 110", type: "expense_input", nextStep: "step2_report_input" },
  { id: "continue_step1", text: "Continuar", type: "continue", nextStep: "step2_report_input" },
]

const step2ExampleMessages: ExampleMessage[] = [
  {
    id: "report_example",
    text: "quanto eu gastei nos últimos dias?",
    type: "report_input",
    nextStep: "step3_mixed_input",
  },
  { id: "continue_step2", text: "Continuar", type: "continue", nextStep: "step3_mixed_input" },
]

const step3ExampleMessages: ExampleMessage[] = [
  {
    id: "mixed_example",
    text: "quero juntar 200000 para casa própria até 2027 e já tenho 20%, gastei 100 com lanches, gasolina no carro 150 recebi 300 serviço pessoal e quero que me lembre de acordar amanhã 9hs",
    type: "mixed_input",
    nextStep: "step4_goal_input",
  },
  { id: "continue_step3", text: "Continuar", type: "continue", nextStep: "step4_goal_input" },
]

const step4ExampleMessages: ExampleMessage[] = [
  {
    id: "goal_example",
    text: "preciso de uma meta pra juntar 111 mil para trocar moto e já tenho 2%",
    type: "goal_input",
    nextStep: "end_demo",
  },
  { id: "continue_step4", text: "Continuar", type: "continue", nextStep: "end_demo" },
]

const endDemoMessages: ExampleMessage[] = [
  { id: "restart_demo", text: "Reiniciar Demonstração", type: "initial", nextStep: "initial" },
]

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const [currentStep, setCurrentStep] = useState<
    "initial" | "step1_expense_input" | "step2_report_input" | "step3_mixed_input" | "step4_goal_input" | "end_demo"
  >("initial")
  const [currentInput, setCurrentInput] = useState<string>("") // For the input field in step 1
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, setMessages, append, isLoading } = useChat({
    api: "/api/agent", // Pointing to our new proxy API route
    onFinish: () => {
      scrollToBottom()
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText: string, messageType: ExampleMessage["type"]) => {
    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), content: messageText, role: "user" }])

    // Call the API
    await append({ content: messageText, role: "user" })

    // Advance step if it's a specific demo message
    if (messageType === "initial" && messageText === "Demonstração") {
      setCurrentStep("step1_expense_input")
    } else if (messageType === "expense_input" && messageText === "camisa 110") {
      setCurrentStep("step2_report_input")
    } else if (messageType === "report_input" && messageText === "quanto eu gastei nos últimos dias?") {
      setCurrentStep("step3_mixed_input")
    } else if (messageType === "mixed_input") {
      setCurrentStep("step4_goal_input")
    } else if (messageType === "goal_input") {
      setCurrentStep("end_demo")
    } else if (messageType === "continue") {
      if (currentStep === "step1_expense_input") setCurrentStep("step2_report_input")
      else if (currentStep === "step2_report_input") setCurrentStep("step3_mixed_input")
      else if (currentStep === "step3_mixed_input") setCurrentStep("step4_goal_input")
      else if (currentStep === "step4_goal_input") setCurrentStep("end_demo")
    } else if (messageType === "initial" && messageText === "Reiniciar Demonstração") {
      setMessages([])
      setCurrentStep("initial")
    }
  }

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (currentInput.trim() === "") return
    await handleSendMessage(currentInput, "expense_input") // Treat as expense input for step 1
    setCurrentInput("")
  }

  const renderMessageContent = (message: any) => {
    // Assuming agent responses are structured JSON in message.content
    try {
      const parsedContent = JSON.parse(message.content)

      if (parsedContent.type === "landing_page") {
        return (
          <div className="flex flex-col items-center text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">
              A mesma tecnologia usada por gerentes de investimentos.
            </p>
            <h2 className="text-2xl font-bold mb-4">
              Economize <span className="text-controla-orange">+ de 300 Reais Em</span>
              <br />
              <span className="text-controla-orange">30 Dias</span> Sem Cortar Os "Luxos"
              <br />E Apenas Com O Whatsapp.
            </h2>
            <p className="text-muted-foreground mb-8">
              Não é app, nem planilha, nem Notion, <br />é inteligência artificial de ponta.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <Card className="bg-controla-light-green text-left p-4">
                <CardTitle className="text-base font-semibold mb-2">Para onde vai seu dinheiro?</CardTitle>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  Você trabalha o mês inteiro, mas no final{" "}
                  <span className="font-bold">nunca sabe onde foi parar tudo que ganhou.</span>
                </CardContent>
              </Card>
              <Card className="bg-controla-light-green text-left p-4">
                <CardTitle className="text-base font-semibold mb-2">Sem planilhas ou apps</CardTitle>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  São soluções complicadas que dão preguiça de usar.{" "}
                  <span className="font-bold">Aqui você resolve tudo no Whatsapp.</span>
                </CardContent>
              </Card>
              <Card className="bg-controla-light-green text-left p-4">
                <CardTitle className="text-base font-semibold mb-2">Perdido nas dívidas</CardTitle>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  Não sabe quanto paga de parcela, quanto tempo falta, quem deve, e{" "}
                  <span className="font-bold">não tem um plano para pagar.</span>
                </CardContent>
              </Card>
              <Card className="bg-controla-light-green text-left p-4">
                <CardTitle className="text-base font-semibold mb-2">Pagando mais caro sempre</CardTitle>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  Você compra por impulso ou não pesquisa antes,{" "}
                  <span className="font-bold">gastando mais e deixando de economizar.</span>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      } else if (parsedContent.type === "how_it_works_step1") {
        return (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Como Funciona?</h2>
            <p className="text-muted-foreground mb-4">
              Um assistente financeiro no seu WhatsApp, <br />
              disponível 24h para ser seu{" "}
              <span className="font-bold">
                controle <br />
                financeiro interativo.
              </span>
            </p>
            <Button className="bg-controla-orange text-white hover:bg-controla-orange/90 mb-8">Demonstração</Button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-controla-orange text-4xl font-bold">1.</span>
              <p className="text-lg text-left">
                Digite o que comprou e quanto custou, por exemplo: <span className="font-bold">"camisa 110".</span>
              </p>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Registre um gasto (real ou falso) para testar.</p>
            <p className="text-muted-foreground text-sm mb-8">
              Não se preocupe com vírgulas, nem com por "R$", escreva do seu jeito.
            </p>
          </div>
        )
      } else if (parsedContent.type === "how_it_works_step2") {
        return (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Como Funciona?</h2>
            <p className="text-muted-foreground mb-4">
              Um assistente financeiro no seu WhatsApp, <br />
              disponível 24h para ser seu{" "}
              <span className="font-bold">
                controle <br />
                financeiro interativo.
              </span>
            </p>
            <Button className="bg-controla-orange text-white hover:bg-controla-orange/90 mb-8">Demonstração</Button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-controla-orange text-4xl font-bold">2.</span>
              <p className="text-lg text-left">
                Você pode perguntar{" "}
                <span className="font-bold">
                  TUDO <br />
                  SOBRE SUAS FINANÇAS.
                </span>
              </p>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              Exemplo: Digamos que você quer ver <br />
              quanto gastou nos últimos dias:
            </p>
          </div>
        )
      } else if (parsedContent.type === "expense_added") {
        const { description, amount, date, category, id, reminder } = parsedContent.data
        return (
          <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
            <div className="flex items-center mb-2">
              <CheckCircle2Icon className="text-whatsapp-green mr-2" size={20} />
              <span className="font-semibold text-sm">Despesa adicionada ! !</span>
            </div>
            <div className="flex items-center mb-1">
              <ReceiptTextIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">{description}</span>
              <span className="text-gray-500 text-xs ml-1">({category})</span>
            </div>
            <div className="flex items-center mb-1">
              <WalletIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">R$ {amount.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex items-center mb-2">
              <CalendarDaysIcon className="mr-2 text-gray-600" size={16} />
              <span className="text-sm">{date}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <p className="text-xs text-gray-500">ID da despesa: {id}</p>
            {reminder && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-xs">
                <LightbulbIcon className="inline mr-1" size={14} />
                Lembrete: {reminder}
              </div>
            )}
          </Card>
        )
      } else if (parsedContent.type === "income_added") {
        const { description, amount, date, category, id } = parsedContent.data
        return (
          <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
            <div className="flex items-center mb-2">
              <CheckCircle2Icon className="text-whatsapp-green mr-2" size={20} />
              <span className="font-semibold text-sm">Receita adicionada ! !</span>
            </div>
            <div className="flex items-center mb-1">
              <WalletIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">{description}</span>
              <span className="text-gray-500 text-xs ml-1">({category})</span>
            </div>
            <div className="flex items-center mb-1">
              <WalletIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">R$ {amount.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex items-center mb-2">
              <CalendarDaysIcon className="mr-2 text-gray-600" size={16} />
              <span className="text-sm">{date}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <p className="text-xs text-gray-500">ID da receita: {id}</p>
          </Card>
        )
      } else if (parsedContent.type === "goal_added") {
        const { description, totalValue, progress, targetDate, observation, id } = parsedContent.data
        return (
          <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
            <div className="flex items-center mb-2">
              <GoalIcon className="text-controla-orange mr-2" size={20} />
              <span className="font-semibold text-sm">Meta adicionada ! !</span>
            </div>
            <div className="flex items-center mb-1">
              <GoalIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">{description}</span>
            </div>
            <div className="flex items-center mb-1">
              <WalletIcon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">Valor alvo: R$ {totalValue.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex items-center mb-1">
              <BarChart3Icon className="mr-2 text-gray-600" size={16} />
              <span className="font-bold text-base">Progresso: {progress.toFixed(1)}%</span>
            </div>
            <div className="flex items-center mb-2">
              <CalendarDaysIcon className="mr-2 text-gray-600" size={16} />
              <span className="text-sm">Data alvo: {targetDate}</span>
            </div>
            {observation && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-xs">
                <LightbulbIcon className="inline mr-1" size={14} />
                Observação: {observation}
              </div>
            )}
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <p className="text-xs text-gray-500">ID da meta: {id}</p>
          </Card>
        )
      } else if (parsedContent.type === "report_summary") {
        const { period, balance, top_categories, insights } = parsedContent.data // Removed whatsapp_text
        return (
          <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
            <div className="flex items-center mb-2">
              <BarChart3Icon className="text-whatsapp-green mr-2" size={20} />
              <span className="font-semibold text-sm">📊 RESUMO FINANCEIRO</span>
            </div>
            <p className="text-sm mb-2">
              📅 Período: <span className="font-bold">{period}</span>
            </p>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <p className="font-bold text-sm mb-1">💰 BALANÇO GERAL</p>
            <p className="text-sm">
              📈 Receitas: <span className="font-bold">R$ {balance.income.toFixed(2).replace(".", ",")}</span>
            </p>
            <p className="text-sm">
              📉 Despesas: <span className="font-bold">R$ {balance.expenses.toFixed(2).replace(".", ",")}</span>
            </p>
            <p className="text-sm">
              💵 Saldo: <span className="font-bold">R$ {balance.net.toFixed(2).replace(".", ",")}</span>
            </p>
            <p className="text-sm">
              📊 Taxa de economia: <span className="font-bold">{balance.savings_rate.toFixed(1)}%</span>
            </p>
            {top_categories && top_categories.length > 0 && (
              <>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <p className="font-bold text-sm mb-1">Principais Categorias:</p>
                {top_categories.map((cat: any, i: number) => (
                  <p key={i} className="text-sm">
                    - {cat.name}: R$ {cat.amount.toFixed(2).replace(".", ",")} ({cat.percentage.toFixed(1)}%)
                  </p>
                ))}
              </>
            )}
            {insights && insights.length > 0 && (
              <>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <p className="font-bold text-sm mb-1">Insights:</p>
                {insights.map((insight: string, i: number) => (
                  <p key={i} className="text-sm">
                    - {insight}
                  </p>
                ))}
              </>
            )}
            {/* Render dynamic charts */}
            <FinancialCharts topCategories={top_categories} balance={balance} />
          </Card>
        )
      } else if (parsedContent.type === "text_response") {
        return parsedContent.content
      }

      // Fallback for unhandled structured content or plain text
      return message.content
    } catch (e) {
      // If content is not JSON, display as plain text
      return message.content
    }
  }

  const renderExampleButtons = () => {
    let buttons: ExampleMessage[] = []
    let showInput = false

    if (currentStep === "initial") {
      buttons = initialExampleMessages
    } else if (currentStep === "step1_expense_input") {
      buttons = step1ExampleMessages
      showInput = true
    } else if (currentStep === "step2_report_input") {
      buttons = step2ExampleMessages
    } else if (currentStep === "step3_mixed_input") {
      buttons = step3ExampleMessages
    } else if (currentStep === "step4_goal_input") {
      buttons = step4ExampleMessages
    } else if (currentStep === "end_demo") {
      buttons = endDemoMessages
    }

    return (
      <div className="flex flex-col gap-2 p-4">
        {showInput && (
          <form onSubmit={handleInputSubmit} className="flex w-full space-x-2 mb-4">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Exemplo: ifood 44"
              className="flex-grow border-whatsapp-green focus:border-whatsapp-green focus:ring-whatsapp-green"
            />
            <Button
              type="submit"
              className="bg-whatsapp-green hover:bg-whatsapp-green/90 text-white rounded-full p-2 size-10"
            >
              <ArrowUpIcon size={20} />
            </Button>
          </form>
        )}
        {buttons.map((msg) => (
          <Button
            key={msg.id}
            onClick={() => handleSendMessage(msg.text, msg.type)}
            className={cn(
              "w-full text-left justify-start px-4 py-2 rounded-full",
              msg.type === "initial" || msg.type === "continue"
                ? "bg-controla-orange hover:bg-controla-orange/90 text-white"
                : "bg-whatsapp-green hover:bg-whatsapp-green/90 text-white",
            )}
            disabled={isLoading}
          >
            {msg.text}
          </Button>
        ))}
      </div>
    )
  }

  const renderHeaderContent = () => {
    if (currentStep === "initial") {
      return (
        <div className="flex flex-col items-center text-center p-4">
          <p className="text-sm text-muted-foreground mb-4">A mesma tecnologia usada por gerentes de investimentos.</p>
          <h2 className="text-2xl font-bold mb-4">
            Economize <span className="text-controla-orange">+ de 300 Reais Em</span>
            <br />
            <span className="text-controla-orange">30 Dias</span> Sem Cortar Os "Luxos"
            <br />E Apenas Com O Whatsapp.
          </h2>
          <p className="text-muted-foreground mb-8">
            Não é app, nem planilha, nem Notion, <br />é inteligência artificial de ponta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Card className="bg-controla-light-green text-left p-4">
              <CardTitle className="text-base font-semibold mb-2">Para onde vai seu dinheiro?</CardTitle>
              <CardContent className="p-0 text-sm text-muted-foreground">
                Você trabalha o mês inteiro, mas no final{" "}
                <span className="font-bold">nunca sabe onde foi parar tudo que ganhou.</span>
              </CardContent>
            </Card>
            <Card className="bg-controla-light-green text-left p-4">
              <CardTitle className="text-base font-semibold mb-2">Sem planilhas ou apps</CardTitle>
              <CardContent className="p-0 text-sm text-muted-foreground">
                São soluções complicadas que dão preguiça de usar.{" "}
                <span className="font-bold">Aqui você resolve tudo no Whatsapp.</span>
              </CardContent>
            </Card>
            <Card className="bg-controla-light-green text-left p-4">
              <CardTitle className="text-base font-semibold mb-2">Perdido nas dívidas</CardTitle>
              <CardContent className="p-0 text-sm text-muted-foreground">
                Não sabe quanto paga de parcela, quanto tempo falta, quem deve, e{" "}
                <span className="font-bold">não tem um plano para pagar.</span>
              </CardContent>
            </Card>
            <Card className="bg-controla-light-green text-left p-4">
              <CardTitle className="text-base font-semibold mb-2">Pagando mais caro sempre</CardTitle>
              <CardContent className="p-0 text-sm text-muted-foreground">
                Você compra por impulso ou não pesquisa antes,{" "}
                <span className="font-bold">gastando mais e deixando de economizar.</span>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    } else if (currentStep === "step1_expense_input") {
      return (
        <div className="flex flex-col items-center text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Como Funciona?</h2>
          <p className="text-muted-foreground mb-4">
            Um assistente financeiro no seu WhatsApp, <br />
            disponível 24h para ser seu{" "}
            <span className="font-bold">
              controle <br />
              financeiro interativo.
            </span>
          </p>
          <Button className="bg-controla-orange text-white hover:bg-controla-orange/90 mb-8">Demonstração</Button>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-controla-orange text-4xl font-bold">1.</span>
            <p className="text-lg text-left">
              Digite o que comprou e quanto custou, por exemplo: <span className="font-bold">"camisa 110".</span>
            </p>
          </div>
          <p className="text-muted-foreground text-sm mb-4">Registre um gasto (real ou falso) para testar.</p>
          <p className="text-muted-foreground text-sm mb-8">
            Não se preocupe com vírgulas, nem com por "R$", escreva do seu jeito.
          </p>
        </div>
      )
    } else if (currentStep === "step2_report_input") {
      return (
        <div className="flex flex-col items-center text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Como Funciona?</h2>
          <p className="text-muted-foreground mb-4">
            Um assistente financeiro no seu WhatsApp, <br />
            disponível 24h para ser seu{" "}
            <span className="font-bold">
              controle <br />
              financeiro interativo.
            </span>
          </p>
          <Button className="bg-controla-orange text-white hover:bg-controla-orange/90 mb-8">Demonstração</Button>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-controla-orange text-4xl font-bold">2.</span>
            <p className="text-lg text-left">
              Você pode perguntar{" "}
              <span className="font-bold">
                TUDO <br />
                SOBRE SUAS FINANÇAS.
              </span>
            </p>
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            Exemplo: Digamos que você quer ver <br />
            quanto gastou nos últimos dias:
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none bg-gray-100",
        className,
      )}
      {...props}
    >
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          renderHeaderContent()
        ) : (
          <div className="my-4 flex h-fit min-h-full flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                data-role={message.role}
                className={cn(
                  "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "self-end bg-whatsapp-green text-white"
                    : "self-start bg-whatsapp-light-green text-black",
                )}
              >
                {renderMessageContent(message)}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-whatsapp-light-green text-black rounded-xl px-3 py-2 text-sm">
                AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="sticky bottom-0 bg-gray-100 w-full">{renderExampleButtons()}</div>
    </main>
  )
}
