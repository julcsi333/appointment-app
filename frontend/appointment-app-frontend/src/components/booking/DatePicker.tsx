import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { TimeView } from '@mui/x-date-pickers/models';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface DatePickerProps {
    id: string;
    selectedService: string;
    onTimeSelect: (date: Dayjs | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, selectedService, onTimeSelect }) => {
    const dates: Dayjs[] = generateRandomDates();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [timePickerEnabled, setTimePickerEnabled] = useState<boolean>(false);

    const handleDateSelect = (time: Dayjs | null) => {
        console.log(`Date select: ${time}`)
        if (time === null) {
            setTimePickerEnabled(false);
        } else {
            setTimePickerEnabled(true);
        }
        setSelectedDate(time);
        // Picked a different day, must pick a time for that day
        onTimeSelect(null);
    };

    const handleTimeSelect = (time: Dayjs | null) => {
        console.log(`Time select: ${time}`)
        if (time === null) {
            onTimeSelect(time);
            if (selectedDate !== null) {
                const timeReset = selectedDate.set('hour', 0);
                timeReset.set('minute', 0);
                setSelectedDate(timeReset)
            }
        } else {
            setSelectedDate(time);
            onTimeSelect(time);
        }
    };
    
    const shouldDisableDate = (value: Dayjs) => {
        let shouldDisable = true;
        dates.forEach((date, index) => {
            if (date.date() === value.date() && date.month() === value.month() && date.year() === value.year()) {
                shouldDisable = false;
            }
        });
        return shouldDisable;
    };

    const shouldDisableTime = (value: Dayjs, view: TimeView) => {
        let shouldDisable = true;
        dates.forEach((date, index) => {
            if (date === value) {
                shouldDisable = false;
            }
        });
        return shouldDisable;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiDatePicker
                value={selectedDate}
                onChange={(newValue) => handleDateSelect(newValue)}
                shouldDisableDate={shouldDisableDate}
                views={['year', 'month', 'day']}
            />
            <DigitalClock disabled={timePickerEnabled} value={selectedDate} onChange={(newValue) => handleTimeSelect(newValue)} ampm={false} timeStep={30} shouldDisableTime={shouldDisableTime}/>
        </LocalizationProvider>
    );
};

export default DatePicker;


const generateRandomDates = (): Dayjs[] => {
    const dates: Dayjs[] = [];
    let date = dayjs("2024-04-28");
    date.hour(15);
    dates.push(date);

    date = dayjs("2024-04-28");
    date.hour(16);
    date.minute(30);
    dates.push(date);

    date = dayjs("2024-04-29");
    date.hour(15);
    dates.push(date);

    date = dayjs("2024-04-29");
    date.hour(16);
    date.minute(30);
    dates.push(date);

    date = dayjs("2024-04-30");
    date.hour(15);
    dates.push(date);

    date = dayjs("2024-04-30");
    date.hour(16);
    date.minute(30);
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
  