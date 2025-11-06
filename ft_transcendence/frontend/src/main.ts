import { LandingPage } from './components/LandingPage';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    
    if (!appElement) {
        console.error('App element not found!');
        return;
    }

    const landingPage = new LandingPage(appElement);
    landingPage.render();
    
    console.log('Ping Pong Arena landing page loaded successfully!');
});