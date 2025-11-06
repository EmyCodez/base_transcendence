export class LandingPage {
  private app: HTMLElement;
  private username: string | null = null;

  constructor(app: HTMLElement) {
    this.app = app;
  }

  public async render(): Promise<void> {
    this.app.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.initAnimations();

    // Check JWT token and load user info
    await this.checkSession();
  }

  private getHTML(): string {
    return `
      <!-- Navigation -->
      <nav class="flex justify-center items-center px-6 py-4 md:px-12 md:py-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
            <i class="fas fa-table-tennis-paddle-ball text-white"></i>
          </div>
          <h1 class="text-2xl font-bold text-center">Ping Pong <span class="text-amber-500">Arena</span></h1>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative px-6 py-12 md:px-12 md:py-24 flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <div class="hero-gradient absolute top-0 left-0 w-full h-full pointer-events-none"></div>

        <div class="md:w-1/2 mb-12 md:mb-0 z-10" id="heroContent">
          ${this.username ? this.getWelcomeHTML() : this.getAuthButtonsHTML()}
        </div>

        <div class="md:w-1/2 flex justify-center z-10">
          <div class="relative">
            <div class="w-80 h-64 ping-pong-table rounded-2xl floating">
              <div class="absolute bottom-16 right-28 w-6 h-6 ping-pong-ball rounded-full ball-bounce" style="animation-delay: 0.5s;"></div>
            </div>

            <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
            <div class="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl"></div>

            <!-- Paddles -->
            <div class="absolute -left-10 top-1/2 transform -translate-y-1/2">
              <div class="w-6 h-20 bg-amber-500 rounded-lg paddle-animation"></div>
            </div>
            <div class="absolute -right-10 top-1/2 transform -translate-y-1/2">
              <div class="w-6 h-20 bg-blue-500 rounded-lg paddle-animation" style="animation-delay: 1s;"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="px-6 py-16 md:px-12 md:py-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Game Modes</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Choose your preferred way to play and compete in our exciting ping pong arena
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="p-8 rounded-2xl border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 text-center feature-card" id="tryAiBtn">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg glow mx-auto">
              <i class="fas fa-robot text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-4">AI Challenge</h3>
          </div>

          <div class="p-8 rounded-2xl border-2 border-gray-700 hover:border-green-500 transition-all duration-300 text-center feature-card" id="multiplayerBtn">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-6 shadow-lg glow mx-auto">
              <i class="fas fa-users text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-4">Multiplayer Mode</h3>
          </div>

          <div class="p-8 rounded-2xl border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 text-center feature-card" id="tournamentBtn">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 shadow-lg glow mx-auto">
              <i class="fas fa-trophy text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-4">Tournaments</h3>
          </div>
        </div>
      </section>

      <footer class="text-center text-slate-400 py-8 text-sm">
        © 2025 Ping Pong Arena | All rights reserved
      </footer>

      <!-- Modal Container -->
      <div id="modalContainer" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center hidden z-50">
        <div id="modalContent" class="bg-slate-800 rounded-xl p-8 w-96 shadow-2xl text-center"></div>
      </div>
    `;
  }

  private getAuthButtonsHTML(): string {
    return `
      <h2 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        The Ultimate <span class="text-gradient">Multiplayer</span> Ping Pong Experience
      </h2>
      <p class="text-xl text-gray-300 mb-8 max-w-lg">
        Challenge AI, compete with friends, or join tournaments in the most exciting table tennis game ever created!
      </p>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <button id="loginBtn" class="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg">
          Log In
        </button>
        <button id="createAccountBtn" class="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 btn-glow">
          Create Account
        </button>
      </div>
    `;
  }

  private getWelcomeHTML(): string {
    return `
      <h2 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Welcome back, <span class="text-gradient">${this.username}</span>!
      </h2>
      <p class="text-xl text-gray-300 mb-8 max-w-lg">
        Ready to dive back into the arena? Choose your mode below and start playing!
      </p>
      <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg">
        Log Out
      </button>
    `;
  }

  private attachEventListeners(): void {
    document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginForm());
    document.getElementById('createAccountBtn')?.addEventListener('click', () => this.showRegisterForm());
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    document.getElementById('tryAiBtn')?.addEventListener('click', () => alert('AI Challenge coming soon!'));
    document.getElementById('multiplayerBtn')?.addEventListener('click', () => alert('Multiplayer Mode coming soon!'));
    document.getElementById('tournamentBtn')?.addEventListener('click', () => alert('Tournaments coming soon!'));
  }

  private initAnimations(): void {
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('mouseenter', () => (card as HTMLElement).classList.add('scale-105'));
      card.addEventListener('mouseleave', () => (card as HTMLElement).classList.remove('scale-105'));
    });
  }

  // ===== AUTH LOGIC =====

  private async checkSession(): Promise<void> {
    const token = localStorage.getItem('jwt');
    if (!token) return;
  
    try {
      const response = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
  
      if (response.ok && user.username) {
        this.username = user.username;
        this.updateHero();
      } else {
        localStorage.removeItem('jwt');
      }
    } catch {
      localStorage.removeItem('jwt');
    }
  }
  
  private updateHero(): void {
    const hero = document.getElementById('heroContent');
    if (hero) {
      hero.innerHTML = this.username ? this.getWelcomeHTML() : this.getAuthButtonsHTML();
      this.attachEventListeners();
    }
  }

  private logout(): void {
    localStorage.removeItem('jwt');
    this.username = null;
    this.updateHero();
  }

  private showLoginForm(): void {
    this.showModal(`
      <h2 class="text-2xl font-bold mb-4">Log In</h2>
      <input id="loginEmail" type="email" placeholder="Email" class="w-full mb-3 p-3 rounded bg-slate-700 text-white">
      <input id="loginPassword" type="password" placeholder="Password" class="w-full mb-6 p-3 rounded bg-slate-700 text-white">
      <button id="submitLogin" class="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold">Log In</button>
      <p class="mt-4 text-sm text-gray-400">Don't have an account? <a id="switchToRegister" class="text-amber-500 cursor-pointer">Register</a></p>
    `);

    document.getElementById('submitLogin')?.addEventListener('click', () => this.handleLogin());
    document.getElementById('switchToRegister')?.addEventListener('click', () => this.showRegisterForm());
  }

  private showRegisterForm(): void {
    this.showModal(`
      <h2 class="text-2xl font-bold mb-4">Create Account</h2>
      <input id="registerUsername" type="text" placeholder="Username" class="w-full mb-3 p-3 rounded bg-slate-700 text-white">
      <input id="registerEmail" type="email" placeholder="Email" class="w-full mb-3 p-3 rounded bg-slate-700 text-white">
      <input id="registerPassword" type="password" placeholder="Password" class="w-full mb-6 p-3 rounded bg-slate-700 text-white">
      <button id="submitRegister" class="w-full bg-amber-500 hover:bg-amber-600 py-3 rounded-lg font-semibold text-gray-900">Register</button>
      <p class="mt-4 text-sm text-gray-400">Already have an account? <a id="switchToLogin" class="text-blue-400 cursor-pointer">Log in</a></p>
    `);

    document.getElementById('submitRegister')?.addEventListener('click', () => this.handleRegister());
    document.getElementById('switchToLogin')?.addEventListener('click', () => this.showLoginForm());
  }

  private async handleLogin(): Promise<void> {
    const email = (document.getElementById('loginEmail') as HTMLInputElement)?.value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement)?.value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('jwt', data.token);
        this.hideModal();
        await this.checkSession();
        alert('Login successful!');
      } else {
        alert(data.error || 'Login failed.');
      }
    } catch {
      alert('Server unreachable.');
    }
  }

  private async handleRegister(): Promise<void> {
    const username = (document.getElementById('registerUsername') as HTMLInputElement)?.value;
    const email = (document.getElementById('registerEmail') as HTMLInputElement)?.value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement)?.value;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        alert('Account created! Please log in.');
        this.showLoginForm();
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch {
      alert('Server unreachable.');
    }
  }

  private showModal(content: string): void {
    const modal = document.getElementById('modalContainer');
    const modalContent = document.getElementById('modalContent');
    if (modal && modalContent) {
      modalContent.innerHTML = content;
      modal.classList.remove('hidden');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hideModal();
      });
    }
  }

  private hideModal(): void {
    const modal = document.getElementById('modalContainer');
    if (modal) modal.classList.add('hidden');
  }
}
