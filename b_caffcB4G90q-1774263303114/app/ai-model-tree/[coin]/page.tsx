"use client"

import { useState, useEffect, useCallback, use } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MarkerType,
  useNodesState,
  useEdgesState,
  Edge,
  Node
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion } from "framer-motion"
import { Brain, Sparkles, TrendingUp, Activity, Crosshair, Network, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

// A beautifully styled custom node for the Next.js ReactFlow engine to meet the MOONIQ design system 
const CustomNode = ({ data, selected }: any) => {
  return (
    <div className={cn(
      "px-5 py-3 rounded-xl border-2 transition-all shadow-lg backdrop-blur-md min-w-[200px]",
      selected 
        ? "border-neon-blue bg-neon-blue/20 shadow-[0_0_20px_rgba(0,209,255,0.4)]" 
        : "border-border/50 bg-[#111827]/90 hover:border-electric-purple/50 cursor-pointer"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded bg-background/50 border flex items-center justify-center shrink-0",
          selected ? "border-neon-blue text-neon-blue" : "border-border text-electric-purple"
        )}>
           <Network className="w-4 h-4" />
        </div>
        <div>
           <h3 className="text-sm font-bold text-foreground leading-tight">{data.label}</h3>
           {data.sub && <span className="text-[10px] text-muted-foreground uppercase">{data.sub}</span>}
        </div>
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export default function AIModelTreePage({ params }: { params: Promise<{ coin: string }> }) {
  const unwrappedParams = use(params)
  const coin = unwrappedParams.coin
  
  const [treeData, setTreeData] = useState<any>(null)
  const [selectedLayer, setSelectedLayer] = useState<any>(null)
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/model-tree/${coin}`)
      const data = await res.json()
      setTreeData(data)
      
      // Compute React Flow Graph Struct
      if (data.model_layers && data.model_layers.length > 0) {
        const generatedNodes: Node[] = data.model_layers.map((layer: any, i: number) => ({
          id: layer.id,
          type: "custom",
          position: { x: 0, y: i * 120 },
          data: { label: layer.name, sub: layer.units !== "N/A" ? `${layer.units} units` : layer.activation, layerData: layer }
        }))
        
        const generatedEdges: Edge[] = data.model_layers.slice(0, -1).map((layer: any, i: number) => ({
          id: `e-${layer.id}-${data.model_layers[i+1].id}`,
          source: layer.id,
          target: data.model_layers[i+1].id,
          animated: true,
          style: { stroke: '#00D1FF', strokeWidth: 2, opacity: 0.7 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00D1FF' }
        }))
        
        setNodes(generatedNodes)
        setEdges(generatedEdges)
        
        if (!selectedLayer) {
           setSelectedLayer(data.model_layers[0])
        } else {
           // update selected structure reference
           const match = data.model_layers.find((l:any) => l.id === selectedLayer.id)
           if (match) setSelectedLayer(match)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [coin, selectedLayer, setNodes, setEdges])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const onNodeClick = (_: any, node: Node) => {
    if (node.data.layerData) {
       setSelectedLayer(node.data.layerData)
    }
  }

  if (!treeData) {
    return (
      <DashboardLayout>
         <div className="flex h-[80vh] items-center justify-center">
            <div className="w-10 h-10 border-2 border-neon-blue border-r-transparent rounded-full animate-spin"></div>
         </div>
      </DashboardLayout>
    )
  }

  const { prediction, feature_importance } = treeData
  const isBullish = prediction.trend === 'bullish'

  return (
    <DashboardLayout 
      title={<span className="text-neon-blue text-glow-blue flex items-center gap-3">
        <Brain className="w-8 h-8" />
        Explainable AI Engine: {coin}
      </span>}
      subtitle="Visualizing real-time predictive infrastructure and localized feature importance weighting."
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[800px]">
        
        {/* LEFT COLUMN: Data Panel */}
        <div className="xl:col-span-1 space-y-6 flex flex-col pt-[1px]">
           
           {/* Prediction Header */}
           <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent pointer-events-none" />
             <div className="relative z-10 space-y-4">
               
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-display font-bold text-foreground">
                   {coin} Prediction
                 </h2>
                 <div className={cn(
                   "px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1",
                   isBullish ? "bg-signal-green/20 text-signal-green" : "bg-signal-red/20 text-signal-red"
                 )}>
                    {isBullish ? <TrendingUp className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    {isBullish ? "BULLISH" : "BEARISH"}
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Current Price</span>
                    <span className="text-xl font-mono text-foreground">${prediction.current_price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">AI Target</span>
                    <span className={cn(
                       "text-xl font-mono font-bold",
                       isBullish ? "text-signal-green" : "text-signal-red"
                    )}>
                      ${prediction.predicted_price.toLocaleString()}
                    </span>
                  </div>
               </div>
               
               <div className="pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Model Confidence Validation</span>
                  <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-border/30">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn(
                           "h-full rounded-full relative",
                           prediction.confidence > 0.8 ? "bg-electric-purple shadow-[0_0_15px_#B200FF]" : "bg-neon-blue"
                        )}
                     />
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-muted-foreground">0%</span>
                    <span className="font-bold text-foreground">{Math.round(prediction.confidence * 100)}% Verified</span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
               </div>

             </div>
           </div>

           {/* Feature Importance Bar Chart */}
           <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                 <Crosshair className="w-4 h-4 text-electric-purple" />
                 Feature Heatmap
              </h3>
              <div className="space-y-4 flex-1">
                 {Object.entries(feature_importance).sort((a: any, b: any) => b[1] - a[1]).map(([feature, val]: any, i) => (
                    <div key={feature} className="space-y-1">
                       <div className="flex justify-between text-xs">
                          <span className="text-foreground/80 font-medium">{feature}</span>
                          <span className="text-neon-blue font-mono">{Math.round(val * 100)}%</span>
                       </div>
                       <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${val * 100}%` }}
                             transition={{ duration: 0.8, delay: i * 0.1 }}
                             className="h-full bg-neon-blue"
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* CENTER COLUMN: Interactive React Flow Graph */}
        <div className="xl:col-span-2 bg-[#0B0F1A]/90 backdrop-blur-xl border border-border/50 rounded-2xl relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] h-full flex items-center justify-center">
            {/* Soft grid background override specific for the flow container */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
            
            <ReactFlow
               nodes={nodes}
               edges={edges}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
               onNodeClick={onNodeClick}
               nodeTypes={nodeTypes}
               fitView
               fitViewOptions={{ padding: 0.2 }}
               className="w-full h-full"
               proOptions={{ hideAttribution: true }}
            >
              <Background color="#2a2e3d" gap={20} size={1} />
              <Controls className="fill-foreground bg-card/80 border-border/50" />
            </ReactFlow>

            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border border-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-muted-foreground shadow-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Pipeline Active
            </div>
        </div>

        {/* RIGHT COLUMN: Layer Explanation Modal Logic */}
        <div className="xl:col-span-1 border border-electric-purple/30 bg-[#111827]/90 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_30px_rgba(178,0,255,0.05)] h-full relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 w-32 h-32 bg-electric-purple/10 blur-[50px] pointer-events-none" />
           
           <h3 className="text-sm font-bold text-electric-purple flex items-center gap-2 mb-6 uppercase tracking-wider relative z-10">
              <Cpu className="w-4 h-4" />
              Layer Inspection
           </h3>

           {selectedLayer ? (
              <motion.div 
                 key={selectedLayer.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-6 relative z-10"
              >
                 <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Module ID</span>
                    <span className="font-mono text-sm text-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">{selectedLayer.id}</span>
                 </div>
                 
                 <div>
                    <span className="text-[10px] text-neon-blue uppercase tracking-widest block mb-1">Architecture</span>
                    <h4 className="text-xl font-bold text-foreground">{selectedLayer.name}</h4>
                 </div>

                 <div className="p-4 rounded-xl bg-black/40 border border-border/50 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Units/Heads</span>
                         <span className="font-bold text-foreground">{selectedLayer.units}</span>
                       </div>
                       <div>
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Activation</span>
                         <span className="font-mono text-electric-purple">{selectedLayer.activation}</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Purpose Engine</span>
                    <p className="text-sm text-foreground/80 leading-relaxed p-4 bg-muted/20 border border-border/30 rounded-xl">
                       {selectedLayer.description}
                    </p>
                 </div>

                 <div className="pt-6 mt-auto">
                    <button className="w-full py-2 rounded-lg bg-electric-purple/10 hover:bg-electric-purple/20 border border-electric-purple/30 text-electric-purple text-sm font-bold transition-all">
                       Download Weights
                    </button>
                 </div>
              </motion.div>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50 h-full relative z-10 text-center gap-2">
                 <Network className="w-8 h-8 opacity-50" />
                 <span className="text-sm">Select a network node from the graph to inspect neural weighting and purpose.</span>
              </div>
           )}
        </div>

      </div>
    </DashboardLayout>
  )
}
