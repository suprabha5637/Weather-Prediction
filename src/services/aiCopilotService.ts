import { WeatherDataState } from '../types/weather';

export interface CopilotStructuredResponse {
  answer: string;
  why: string;
  weatherData: string;
  farmImpact: string;
  recommendedAction: string;
  risk: string;
  alternative: string;
  confidence: 'High' | 'Moderate' | 'Low';
}

export interface WhatIfScenarioResult {
  question: string;
  scenario: string;
  expectedWeather: string;
  potentialBenefit: string;
  potentialRisk: string;
  agriculturalImpact: string;
  uncertainty: 'Low' | 'Moderate' | 'High';
  recommendation: 'Recommended' | 'Proceed with Caution' | 'High Risk / Delay';
}

export function generateCopilotResponse(query: string, weather: WeatherDataState): CopilotStructuredResponse {
  const q = query.toLowerCase();

  if (q.includes('rain') && (q.includes('tomorrow') || q.includes('when'))) {
    const day2 = weather.daily15[1];
    return {
      answer: `Low rain probability tomorrow (${day2.rainProb}%). Significant rain is expected starting 16 Sep (18 mm, 60% probability).`,
      why: 'A stable continental air mass remains dominant over Eastern UP for the next 48 hours before the Bay of Bengal low-pressure system moves inland around 15–16 Sep.',
      weatherData: `Tomorrow: ${day2.maxTemp}°C / ${day2.minTemp}°C, Rain chance ${day2.rainProb}%, Expected rainfall ${day2.rainAmount} mm, Wind ${day2.windSpeed} km/h ${day2.windDirection}.`,
      farmImpact: 'Field surfaces will remain dry and suitable for machinery, weeding, and tractor operations without sinking risk.',
      recommendedAction: 'Proceed with planned field activities; delay setting up rain shelters until 14 Sep.',
      risk: 'Over-drying of light sandy-loam topsoil if seedlings are un-mulched.',
      alternative: 'Apply light irrigation during early morning (6:00 AM – 8:00 AM) if topsoil is dry below 3 cm.',
      confidence: 'High',
    };
  }

  if (q.includes('irrigate') || q.includes('water')) {
    return {
      answer: 'Light irrigation is recommended during the next 3 days; withhold heavy irrigation after 14 Sep.',
      why: 'Atmospheric water demand is elevated (ET0 ~4.6 mm/day) and rainfall chance is minimal (<20%) through 14 Sep, followed by heavy rains on 16–18 Sep (total ~61 mm).',
      weatherData: 'Today: 28°C (feels like 30°C), Humidity 68%, Rain chance 20%. 16–18 Sep: Heavy rain expected (up to 25 mm/day).',
      farmImpact: 'Light watering will prevent crop moisture stress while ensuring soil retains pore space to absorb the upcoming mid-month rainfall.',
      recommendedAction: 'Apply 20–25 mm irrigation depth in early mornings using furrow or drip systems.',
      risk: 'Over-irrigation combined with subsequent heavy rain will saturate roots and trigger root-rot / damping-off.',
      alternative: 'If soil moisture probe indicates >70% field capacity, defer irrigation and re-check daily.',
      confidence: 'High',
    };
  }

  if (q.includes('spray') || q.includes('pesticide') || q.includes('fungicide')) {
    return {
      answer: 'Best spraying window is Friday 12 Sep, between 6:00 AM and 9:00 AM.',
      why: 'Conditions will have calm wind (<10 km/h), zero rain probability, moderate relative humidity (62%), and foliage free of heavy dew.',
      weatherData: '12 Sep morning: Wind 10 km/h WNW, Rain probability 10%, Temp 25–28°C, Cloud cover 20%.',
      farmImpact: 'Pesticide droplets adhere to target foliage with minimal drift loss and full rain-fastness prior to the 16 Sep storm front.',
      recommendedAction: 'Spray early morning using hollow-cone nozzles with adjuvant for uniform coverage.',
      risk: 'Avoid spraying after 14 Sep: oncoming winds (>18 km/h) and rains will wash off active ingredients into groundwater.',
      alternative: 'If urgent today, spray between 4:30 PM and 6:00 PM when wind drops below 11 km/h.',
      confidence: 'High',
    };
  }

  if (q.includes('sow') || q.includes('plant')) {
    return {
      answer: 'Sowing is recommended for Maize and Groundnut over the next 48 hours; defer Paddy nursery transplanting until 15 Sep.',
      why: 'Warm soil temperature (26–28°C) and dry topsoil allow good seed drill penetration, while upcoming rains next week will naturally supply germination moisture.',
      weatherData: '10–14 Sep: Average temp 34°C, Dry period. 15–18 Sep: Monsoon showers returning (8–25 mm).',
      farmImpact: 'Seeds will germinate and establish taproots before surface crusting or excessive waterlogging can occur.',
      recommendedAction: 'Treat seeds with Trichoderma viride or Rhizobium before sowing to resist soil-borne fungi.',
      risk: 'Deep sowing (>5 cm) may cause seed asphyxiation if heavy rains on 16 Sep compact the upper seedbed.',
      alternative: 'If field is not leveled, wait until the post-rain clearing window (around 19–20 Sep).',
      confidence: 'Moderate',
    };
  }

  if (q.includes('harvest')) {
    return {
      answer: 'Harvest ripe vegetables (Tomato, Chili, Lady Finger, Brinjal) immediately during the next 4 dry days.',
      why: 'Heavy rainfall predicted for 16–18 Sep (up to 25 mm/day) will cause fruit cracking, fungal blemishes, and muddy field conditions that prevent transport.',
      weatherData: '10–14 Sep: Max 32–37°C, 0 mm rain. 16–18 Sep: Heavy rain (60–70% probability, 18–25 mm).',
      farmImpact: 'Securing harvest now prevents 20–35% economic post-harvest loss and ensures premium market pricing.',
      recommendedAction: 'Pick mature crops in morning hours; store in well-ventilated dry crates away from direct noon sun.',
      risk: 'Delayed picking will leave ripe fruit exposed to fungal rot under 90% humidity on 17 Sep.',
      alternative: 'For grains still at milk stage, ensure drainage trenches are dug to shed upcoming rainwater quickly.',
      confidence: 'High',
    };
  }

  if (q.includes('heat') || q.includes('temperature') || q.includes('hot')) {
    return {
      answer: 'A moderate heat wave is forecast between 13–15 Sep with temperatures reaching 36–38°C.',
      why: 'North-westerly dry continental winds and clear skies (cloud cover <20%) will cause intense daytime solar heating.',
      weatherData: '13–15 Sep: Max Temp 36°C & 37°C, Min 26–27°C, UV Index 8 (High), Humidity dropping to 55%.',
      farmImpact: 'Tender seedlings, flowering vegetables, and young paddy nurseries face heat stress, blossom drop, and moisture deficit.',
      recommendedAction: 'Apply light organic mulching, irrigate in early mornings, and maintain standing water depth of 2–3 cm in paddy nurseries.',
      risk: 'Pollen sterility in flowering maize and sun-scald on tomato fruits.',
      alternative: 'Provide temporary agronet shade over high-value vegetable beds if practicable.',
      confidence: 'High',
    };
  }

  // Default fallback response
  return {
    answer: 'Weather conditions over Varanasi remain favorable for general farm operations for the next 4 days, followed by a heavy monsoon spell.',
    why: 'High pressure ridge brings warm sunny days through 14 Sep, after which a cyclonic circulation over the Bay of Bengal will bring 87 mm total rain across 15–24 Sep.',
    weatherData: 'Current: 28°C, Humidity 68%, Rain Chance 20%. 15-Day total rainfall: 87 mm. Highest Temp: 38°C.',
    farmImpact: 'Good opportunity for field preparation, weeding, and timely harvesting of mature crops.',
    recommendedAction: 'Utilize the dry window through 14 Sep; ensure drainage channels are cleared before 15 Sep.',
    risk: 'Heat stress on 13–15 Sep and potential waterlogging during 16–18 Sep.',
    alternative: 'Monitor daily weather updates and soil moisture probes before scheduling costly chemical inputs.',
    confidence: 'Moderate',
  };
}

export function runWhatIfScenario(scenarioType: string, weather: WeatherDataState): WhatIfScenarioResult {
  switch (scenarioType) {
    case 'sow-tomorrow':
      return {
        question: 'What if I sow tomorrow?',
        scenario: 'Sowing crops on 11 Sep (Tomorrow)',
        expectedWeather: 'Sunny, 33°C / 24°C, Rain probability 10%, Wind 11 km/h NW.',
        potentialBenefit: 'Seeds settle in warm soil for 4 days before beneficial moisture arrives on 15–16 Sep.',
        potentialRisk: 'If seeds are sown too shallow, high afternoon heat (34°C on 12 Sep) could dry out the emerging radicle.',
        agriculturalImpact: 'Strong initial root development for Maize and Groundnut; high germination percentage (>88%).',
        uncertainty: 'Low',
        recommendation: 'Recommended',
      };
    case 'wait-3-days':
      return {
        question: 'What if I wait 3 days before sowing?',
        scenario: 'Sowing on 13–14 Sep (Weekend)',
        expectedWeather: 'High heat (36–37°C), dry air (55% humidity), followed by rain on 15–16 Sep.',
        potentialBenefit: 'Gives additional time for deep tillage and farmyard manure incorporation.',
        potentialRisk: 'Seeds sown on 14 Sep will immediately face torrential 18 mm rain on 16 Sep, risking surface crusting and seed rot.',
        agriculturalImpact: 'Delayed emergence and potential patchy stand requiring re-sowing.',
        uncertainty: 'Moderate',
        recommendation: 'Proceed with Caution',
      };
    case 'irrigate-today':
      return {
        question: 'What if I irrigate today?',
        scenario: 'Applying full irrigation on 10 Sep',
        expectedWeather: 'Warm 28–32°C, dry conditions through 14 Sep, heavy rain (87 mm total) arriving 16–18 Sep.',
        potentialBenefit: 'Replenishes soil moisture for the upcoming 36–37°C heat spell on 13–15 Sep.',
        potentialRisk: 'If soil is over-saturated, the 16–18 Sep rains will cause standing water pools and root asphyxiation.',
        agriculturalImpact: 'Beneficial only if kept to light depth (<25 mm); do not flood the field.',
        uncertainty: 'Low',
        recommendation: 'Recommended',
      };
    case 'spray-tomorrow':
      return {
        question: 'What if I spray tomorrow morning?',
        scenario: 'Applying pesticide/foliar spray on 11 Sep morning (6:00 AM – 9:00 AM)',
        expectedWeather: 'Clear skies, wind 10–12 km/h NW, 24–28°C, zero rainfall for 96 hours.',
        potentialBenefit: '100% rain-fastness achieved; systemic chemicals absorb fully into plant vascular system.',
        potentialRisk: 'Minimal risk if completed before 10:00 AM before ambient temperature exceeds 30°C.',
        agriculturalImpact: 'Effective suppression of aphid and thrip populations before populations expand.',
        uncertainty: 'Low',
        recommendation: 'Recommended',
      };
    case 'harvest-today':
    default:
      return {
        question: 'What if I harvest today?',
        scenario: 'Harvesting mature vegetables (Tomato, Chili, Lady Finger, Brinjal) on 10 Sep',
        expectedWeather: 'Partly cloudy, 28°C, dry field surface, UV 6.',
        potentialBenefit: 'Protects 100% of mature produce from the high temperatures (37°C) and heavy rains (18–25 mm) next week.',
        potentialRisk: 'Labor arrangement needed on short notice.',
        agriculturalImpact: 'Premium crop quality, zero fruit cracking, optimal shelf-life in local mandi.',
        uncertainty: 'Low',
        recommendation: 'Recommended',
      };
  }
}
