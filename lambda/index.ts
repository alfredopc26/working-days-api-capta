import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DateTime, Settings } from 'luxon';
import axios from 'axios';

// Configure Luxon for Colombia timezone
Settings.defaultZone = 'America/Bogota';

// Interface definitions
interface BusinessDateRequest {
  days?: number;
  hours?: number;
  date?: string;
}

interface BusinessHours {
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  lunchStart: { hour: number; minute: number };
  lunchEnd: { hour: number; minute: number };
}

// Cache for holidays
let holidaysCache: string[] = [];
let cacheLastUpdated: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Business hours configuration
const BUSINESS_HOURS: BusinessHours = {
  start: { hour: 8, minute: 0 },
  end: { hour: 17, minute: 0 },
  lunchStart: { hour: 12, minute: 0 },
  lunchEnd: { hour: 13, minute: 0 }
};

// Handler function
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse and validate query parameters

    const params = parseQueryParameters(event.queryStringParameters as { [key: string]: string });

    
    // Validate at least one parameter is provided
    if (params.days === 0 && params.hours === 0) {
      return createErrorResponse('InvalidParameters', 'At least one of days or hours must be provided');
    }

    // Get holidays
    const holidays = await getHolidays();
    
    // Calculate target date
    const targetDate = await calculateTargetDate((params.days || 0), (params.hours || 0), params.date, holidays);
    
    // Return success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: targetDate.toISO() })
    };
  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error instanceof Error) {
      return createErrorResponse('InvalidParameters', error.message);
    }
    
    return createErrorResponse('ServiceUnavailable', 'An unexpected error occurred');
  }
};

// Parse and validate query parameters
function parseQueryParameters(queryParams: { [key: string]: string }): BusinessDateRequest {
  const result: BusinessDateRequest = {};
  
  if (queryParams.days !== undefined) {
    const days = parseInt(queryParams.days, 10);
    if (isNaN(days) || days < 0) {
      throw new Error('Days must be a positive integer');
    }
    result.days = days;
  } else {
    result.days = 0;
  }
  
  if (queryParams.hours !== undefined) {
    const hours = parseInt(queryParams.hours, 10);
    if (isNaN(hours) || hours < 0) {
      throw new Error('Hours must be a positive integer');
    }
    result.hours = hours;
  } else {
    result.hours = 0;
  }
  
  if (queryParams.date !== undefined) {
    // Validate ISO 8601 format with Z suffix
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(queryParams.date)) {
      throw new Error('Date must be in ISO 8601 format with Z suffix');
    }
    result.date = queryParams.date;
  }
  
  return result;
}

// Get holidays with caching
async function getHolidays(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached holidays if still valid
  if (holidaysCache.length > 0 && (now - cacheLastUpdated) < CACHE_TTL) {
    return holidaysCache;
  }
  
  try {
    const response = await axios.get<string[]>(
      'https://content.capta.co/Recruitment/WorkingDays.json',
      { timeout: 5000 }
    );
    
    holidaysCache = response.data;
    cacheLastUpdated = now;
    
    return holidaysCache;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    
    // If we have cached holidays, return them even if expired
    if (holidaysCache.length > 0) {
      return holidaysCache;
    }
    
    throw new Error('Unable to fetch holidays');
  }
}

// Check if a date is a weekend
function isWeekend(date: DateTime): boolean {
  return date.weekday === 6 || date.weekday === 7; // 6 = Saturday, 7 = Sunday
}

// Check if a date is a holiday
function isHoliday(date: DateTime, holidays: string[]): boolean {
  const dateStr = date.toISODate();
  return holidays.some(holiday => holiday === dateStr);
}

// Check if a date is within business hours
function isWithinBusinessHours(date: DateTime): boolean {
  const hour = date.hour;
  const minute = date.minute;
  
  // Before business hours
  if (hour < BUSINESS_HOURS.start.hour || 
      (hour === BUSINESS_HOURS.start.hour && minute < BUSINESS_HOURS.start.minute)) {
    return false;
  }
  
  // After business hours
  if (hour > BUSINESS_HOURS.end.hour || 
      (hour === BUSINESS_HOURS.end.hour && minute > BUSINESS_HOURS.end.minute)) {
    return false;
  }
  
  return true;
}

function isLunchTime(date: DateTime): boolean {
  const hour = date.hour;
  const minute = date.minute;

  // During lunch time
  if ((hour > BUSINESS_HOURS.lunchStart.hour || 
      (hour === BUSINESS_HOURS.lunchStart.hour && minute >= BUSINESS_HOURS.lunchStart.minute)) &&
      (hour < BUSINESS_HOURS.lunchEnd.hour || 
      (hour === BUSINESS_HOURS.lunchEnd.hour && minute < BUSINESS_HOURS.lunchEnd.minute))) {
    return true;
  }

return false;
}

// Adjust date to business hours
function adjustToBusinessHours(date: DateTime, holidays: string[], isWeekendStarted: boolean = false): DateTime {
  let adjustedDate = date;
  
  // If it's weekend or holiday, move to next business day at start time
  while (isWeekend(adjustedDate) || isHoliday(adjustedDate, holidays)) {
    adjustedDate = adjustedDate.plus({ days: 1 }).set({
      hour: BUSINESS_HOURS.start.hour,
      minute: BUSINESS_HOURS.start.minute,
      second: 0,
      millisecond: 0
    });
  }
  const hour = adjustedDate.hour;
  const minute = adjustedDate.minute;

  if(isWeekendStarted){
    adjustedDate = adjustedDate.set({
      hour: BUSINESS_HOURS.end.hour,
      minute: BUSINESS_HOURS.end.minute,
      second: 0,
      millisecond: 0
    });
    return adjustedDate;
  }
  
  // Before business hours
  if (hour < BUSINESS_HOURS.start.hour || 
      (hour === BUSINESS_HOURS.start.hour && minute < BUSINESS_HOURS.start.minute)) {
    adjustedDate = adjustedDate.set({
      hour: BUSINESS_HOURS.start.hour,
      minute: BUSINESS_HOURS.start.minute,
      second: 0,
      millisecond: 0
    });
    return adjustedDate;
  }
  
  // After business hours
  if (hour > BUSINESS_HOURS.end.hour || 
      (hour === BUSINESS_HOURS.end.hour && minute > BUSINESS_HOURS.end.minute)) {
    adjustedDate = adjustedDate.plus({ days: 1 }).set({
      hour: BUSINESS_HOURS.start.hour,
      minute: BUSINESS_HOURS.start.minute,
      second: 0,
      millisecond: 0
    });
    return adjustToBusinessHours(adjustedDate, holidays); // Recursive call for weekends/holidays
  }
  
  // During lunch time
  if ((hour > BUSINESS_HOURS.lunchStart.hour || 
      (hour === BUSINESS_HOURS.lunchStart.hour && minute >= BUSINESS_HOURS.lunchStart.minute)) &&
      (hour < BUSINESS_HOURS.lunchEnd.hour || 
      (hour === BUSINESS_HOURS.lunchEnd.hour && minute < BUSINESS_HOURS.lunchEnd.minute))) {
    adjustedDate = adjustedDate.set({
      hour: BUSINESS_HOURS.lunchStart.hour,
      minute: BUSINESS_HOURS.lunchStart.minute,
      second: 0,
      millisecond: 0
    });
    return adjustedDate;
  }
  
  return adjustedDate;
}

// Calculate target date
async function calculateTargetDate(
  days: number, 
  hours: number, 
  startDateUTC: string | undefined,
  holidays: string[]
): Promise<DateTime> {
  // Get start date in Colombia timezone
  let currentDate = startDateUTC 
    ? DateTime.fromISO(startDateUTC, { zone: 'utc' }).setZone('America/Bogota')
    : DateTime.now().setZone('America/Bogota');
  
  // Process days first
  if (days > 0) {
    currentDate = await addBusinessDays(currentDate, days, holidays);
  }
  
  // Then process hours
  if (hours > 0) {
    currentDate = addBusinessHours(currentDate, hours, holidays);
  }
  // Convert to UTC and return
  return currentDate.setZone('utc');
}

// Add business days
async function addBusinessDays(
  startDate: DateTime, 
  days: number, 
  holidays: string[]
): Promise<DateTime> {
  let currentDate = startDate;
  let daysAdded = 0;
  let weekendStarted = !!isWeekend(currentDate);


  while (daysAdded < days) {
    // Move to next day
    currentDate = currentDate.plus({ days: 1 });
    
    // Skip weekends and holidays
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      daysAdded++;
    }
  }
  
  // Adjust to business hours
  return adjustToBusinessHours(currentDate, holidays, weekendStarted);
}


// Add business hours
function addBusinessHours(
  startDate: DateTime, 
  hours: number, 
  holidays: string[]
): DateTime {
  let currentDate = startDate;
  let hoursAdded = 0;
  
  while (hoursAdded < hours) {
    // Add one hour
    let nextHour = currentDate.plus({ hours: 1 });
    
    // If we're outside business hours, move to next business day
    if (!isWithinBusinessHours(nextHour) || 
        isWeekend(nextHour) || 
        isHoliday(nextHour, holidays)) {
      
      // Move to next business day at start time
      currentDate = moveToNextBusinessDay(currentDate, holidays);

      currentDate = currentDate.plus({ hours: 1 });
    } else if(isLunchTime(nextHour)){
      currentDate = currentDate.plus({ hours: 1 });
      continue;
    }else {
      currentDate = nextHour;
    }
    
    hoursAdded++;
  }
  
  return currentDate;
}

// Move to next business day
function moveToNextBusinessDay(date: DateTime, holidays: string[]): DateTime {
  let currentDate = date;
  
  do {
    // Move to next day
    currentDate = currentDate.plus({ days: 1 }).set({
      hour: BUSINESS_HOURS.start.hour,
      minute: BUSINESS_HOURS.start.minute,
      second: 0,
      millisecond: 0
    });
  } while (isWeekend(currentDate) || isHoliday(currentDate, holidays));
  
  return currentDate;
}

// Create error response
function createErrorResponse(error: string, message: string): APIGatewayProxyResult {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error, message })
  };
}