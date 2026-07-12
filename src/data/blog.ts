export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "mt5-scalper",
    title: "Building a Hybrid CNN-LSTM-Attention Model for Gold Trading",
    summary: "Deep dive into combining 1D CNNs, LSTM layers, and Self-Attention in PyTorch to automate gold (XAUUSD) trading via the MetaTrader 5 API.",
    date: "May 20, 2026",
    readTime: "5 min read",
    tags: ["AI", "Python", "FinTech"],
    content: `<p class="mb-4">Automating financial trading is one of the most challenging applications of Deep Learning. Markets are notoriously noisy, non-stationary, and prone to rapid trend shifts. Standard feed-forward networks struggle to capture both immediate price action patterns and long-term momentum.</p>
    <h3 class="text-base font-bold text-white mt-6 mb-2">The Hybrid Architecture Solution</h3>
    <p class="mb-4">To overcome this, we designed a hybrid network named <strong>CandlePatternAI</strong> in PyTorch consisting of three layers:</p>
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li><strong>1D Convolutional Neural Network (CNN):</strong> Designed for local spatial feature extraction. By sliding over the past 50 candles, the CNN extracts features like shadow ratios, body sizes, and ATR-normalized distances.</li>
      <li><strong>Long Short-Term Memory (LSTM):</strong> Processes the sequence of CNN feature mappings to capture temporal dependencies, identifying if the market is trending or consolidating.</li>
      <li><strong>Self-Attention Layer:</strong> Softmax attention weights the output states of the LSTM, allowing the model to focus on critical price spikes, news candle events, or support/resistance touches within the window.</li>
    </ul>
    <h3 class="text-base font-bold text-white mt-6 mb-2">Backtesting and Results</h3>
    <p class="mb-4">By using GORM and SQLite database integration to bootstrap local pricing feeds, the model was pre-trained offline before deploying directly via the low-latency MetaTrader 5 gateway. Combining attention maps with average true range (ATR) exit targets led to more disciplined position management and lower drawdowns compared to simple LSTM architectures.</p>`
  },
  {
    id: "bi-snap-golang",
    title: "Implementing Secure APIs Complying with BI SNAP Standards",
    summary: "Best practices for implementing Standar Nasional Open API (SNAP) in banking and e-wallet platforms using Go.",
    date: "April 12, 2026",
    readTime: "4 min read",
    tags: ["Go", "Security", "Backend"],
    content: `<p class="mb-4">When building financial technology platforms in Indonesia, complying with Bank Indonesia's <strong>SNAP (Standar Nasional Open API)</strong> is mandatory for digital wallets and bank integrations. These guidelines ensure standard payloads, security, and strict logging across financial transactions.</p>
    <h3 class="text-base font-bold text-white mt-6 mb-2">Key Pillars of SNAP Compliance</h3>
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li><strong>Asymmetric and Symmetric Signatures:</strong> Every incoming B2B request must be validated. The headers require signature checks (using SHA256withRSA for token exchanges, and HMAC-SHA512 for endpoint payloads) to prevent tampering.</li>
      <li><strong>Double Request Prevention (Idempotency):</strong> To prevent double-deducting balances, requests include an <em>External ID</em> (idempotency key). In Go, we cache incoming keys in Redis with short TTLs to reject duplicates instantly.</li>
      <li><strong>API Call Auditing:</strong> Every API call requires an audit footprint with a unique <code>API Call ID</code> to allow cross-system tracing in the event of transaction disputes.</li>
    </ul>
    <h3 class="text-base font-bold text-white mt-6 mb-2">Go Implementation Strategy</h3>
    <p class="mb-4">Using Go's <strong>Gin Web Framework</strong>, we abstract signature verification and idempotency checks into modular middleware layers. This isolates the financial compliance validations from core business services, maintaining clean code architectures.</p>`
  },
  {
    id: "lora-mesh",
    title: "Designing a LoRa Mesh Telemetry System for Off-Grid Tracking",
    summary: "How to deploy peer-to-peer telemetry systems using Arduino transceivers, mesh topology, and WebSockets.",
    date: "March 08, 2026",
    readTime: "6 min read",
    tags: ["IoT", "Hardware", "WebSockets"],
    content: `<p class="mb-4">In remote areas where cellular coverage is non-existent, tracking people or assets requires alternative radio solutions. <strong>LoRa (Long Range)</strong> provides long-distance, low-power telemetry transmissions perfectly suited for off-grid tracking.</p>
    <h3 class="text-base font-bold text-white mt-6 mb-2">Mesh Networking Topology</h3>
    <p class="mb-4">Rather than using a single point-to-point radio link, a mesh topology allows nodes to act as repeaters. If Node A cannot reach the central gateway, it transmits packets to Node B, which relays the telemetry data. This mesh logic allows extended tracking ranges in complex environments.</p>
    <h3 class="text-base font-bold text-white mt-6 mb-2">Real-Time Web Integration</h3>
    <p class="mb-4">Once data packets reach the primary gateway node (which has local internet or VPS access), the telemetry logs are parsed by a Go backend service. By utilizing <strong>WebSockets</strong>, the Go backend pushes the latitude, longitude, device health, and visibility flags to a live React dashboard map, rendering coordinates instantly.</p>`
  }
];
