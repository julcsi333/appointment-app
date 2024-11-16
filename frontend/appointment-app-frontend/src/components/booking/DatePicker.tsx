import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { TimeView } from '@mui/x-date-pickers/models';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Grid, Typography } from '@mui/material';
import { SubService } from '../api/model';

interface DatePickerProps {
    id: number;
    selectedService: SubService;
    prevSelectedDate: Dayjs | null;
    onTimeSelect: (date: Dayjs | null) => void;
}

function isSameDate(date1: dayjs.Dayjs | null, date2: Dayjs | null): boolean {
    if (date1 === null || date2 === null) {
        return false;
    }
    return date1.date() === date2.date() && date1.month() === date2.month() && date1.year() === date2.year()
}

function isSameTime(date1: dayjs.Dayjs | null, date2: Dayjs | null): boolean {
    if (date1 === null || date2 === null) {
        return false;
    }
    return date1.hour() === date2.hour() && date1.minute() === date2.minute()
}

const DatePicker: React.FC<DatePickerProps> = ({ id, prevSelectedDate, selectedService, onTimeSelect }) => {
    const dates: Dayjs[] = generateRandomDates();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(prevSelectedDate);
    const [timePickerEnabled, setTimePickerEnabled] = useState<boolean>(selectedDate !== null);

    const handleDateSelect = (time: Dayjs | null) => {
        console.log(`Date select: ${time?.year()}.${time?.month()}.${time?.date()}`)
        setSelectedDate(time);
        if (time === null) {
            setTimePickerEnabled(false);
        } else {
            setTimePickerEnabled(true);
        }
        // Picked a different day, must pick a time for that day
        onTimeSelect(null);
    };

    const handleTimeSelect = (time: Dayjs | null) => {
        console.log(`Time select: ${time?.hour()}:${time?.minute()}`)
        if (time === null) {
            onTimeSelect(time);
            if (selectedDate !== null) {
                const timeReset = selectedDate.set('hour', 0).set('minute', 0);
                setSelectedDate(timeReset)
            }
        } else {
            const dateAndTime = selectedDate!.set('hour', time.hour()).set('minute', time.minute());
            onTimeSelect(dateAndTime);
        }
    };
    
    const shouldDisableDate = (value: Dayjs) => {
        let shouldDisable = true;
        dates.forEach((date, index) => {
            if (isSameDate(date, value)) {
                shouldDisable = false;
            }
        });
        return shouldDisable;
    };

    const shouldDisableTime = (value: Dayjs, view: TimeView) => {
        let shouldDisable = true;
        dates.forEach((date, index) => {
            if (isSameDate(date, selectedDate)) {
                if (isSameTime(date, value)) {
                    shouldDisable = false;
                    //console.log(`Right: ${date} - ${value}`)
                } else {
                    //console.log(`Wrong: ${date} - ${value}`)
                }
            }
        });
        return shouldDisable;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                Select Date and Time
            </Typography>
            <Grid
                container
                spacing={2}
                justifyContent='space-evenly'
                alignItems="center"
            >
                <Grid item xs={3}>
                    <MuiDatePicker
                        value={selectedDate}
                        onChange={handleDateSelect}
                        shouldDisableDate={shouldDisableDate}
                        views={['year', 'month', 'day']}
                    />
                </Grid>
                <Grid item xs={3}>
                    <DigitalClock disabled={!timePickerEnabled} value={prevSelectedDate} onChange={(newValue) => handleTimeSelect(newValue)} ampm={false} timeStep={15} shouldDisableTime={shouldDisableTime}/>
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
};

export default DatePicker;


const generateRandomDates = (): Dayjs[] => {
    const dates: Dayjs[] = [];
    let date = dayjs("2024-11-28");
    date = date.hour(15);
    dates.push(date);

    date = dayjs("2024-11-28");
    date = date.hour(16);
    date = date.minute(30);
    dates.push(date);

    date = dayjs("2024-11-29");
    date = date.hour(15);
    dates.push(date);

    date = dayjs("2024-11-29");
    date = date.hour(15);
    date = date.minute(15);
    dates.push(date);

    date = dayjs("2024-11-29");
    date = date.hour(15);
    date = date.minute(30);
    dates.push(date);

    date = dayjs("2024-11-29");
    date = date.hour(15);
    date = date.minute(45);
    dates.push(date);

    date = date = dayjs("2024-11-29");
    date = date.hour(16);
    date = date.minute(30);
    dates.push(date);

    date = dayjs("2024-11-30");
    date = date.hour(15);
    dates.push(date);

    date = dayjs("2024-11-30");
    date = date.hour(16);
    date = date.minute(30);
    dates.push(date);

    //dayjs({ year :2010, month :3, day :5, hour :15, minute :10, second :3, millisecond :123});
    /*const startDate = dayjs(); // Get today's date
    const endDate = dayjs().add(14, 'day');

    // Generate random dates for the next 2 weeks
    while (startDate.isBefore(endDate)) {
        const randomHours = Math.floor(Math.random() * 24); // Generate random hour (0-23)
        const randomMinutes = Math.round(Math.random())*30; // Generate random minute (0-30)

        const newDate = startDate.set('hour', randomHours);        
        newDate.set('minute', randomMinutes);

        dates.push(newDate);

        // Move to the next day
        startDate.add(1, 'day');
    }

    const startDate1 = dayjs(); // Get today's date
    const endDate1 = dayjs().add(14, 'day');

    // Generate random dates for the next 2 weeks
    while (startDate1.isBefore(endDate1)) {
        const randomHours = Math.floor(Math.random() * 24); // Generate random hour (0-23)
        const randomMinutes = Math.round(Math.random())*30; // Generate random minute (0-30)

        const newDate = startDate1.set('hour', randomHours);        
        newDate.set('minute', randomMinutes);

        dates.push(newDate);

        // Move to the next day
        startDate1.add(1, 'day');
    }
*/
    return dates;
};
  