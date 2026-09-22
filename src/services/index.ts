// Weather data & utilities
export {
  INITIAL_WEATHER_DATA,
  exportForecastCsv,
  downloadFile,
  convertTemp,
  formatTemp,
  degToCompass,
  mapWmoCode,
  printFarmerWeatherReport,
  weatherService,
} from './weatherService';

// Auth API calls
export { authService } from './authService';

// AI Copilot
export {
  generateCopilotResponse,
  runWhatIfScenario,
} from './aiCopilotService';
