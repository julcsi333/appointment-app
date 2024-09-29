import React from 'react';
import { InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { SubService } from '../api/model';

interface ServiceSelectorProps {
    onServiceSelect: (service: number) => void;
    selectedService: SubService | null;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect, selectedService }) => {
    const defaultOption = "Select an option";
    const defaultOptionId = -1;
    const handleChange = (event: SelectChangeEvent<string>) => {
        const service =Number(event.target.value);
        if (service !== defaultOptionId) {
            onServiceSelect(service); // Update the selected service when dropdown value changes
        }
    };

    return (
        <div>
            <InputLabel id="service-select-label">Select Service</InputLabel>
            <Select
            labelId="service-select-label"
            id="service-select"
            value={selectedService === null ? defaultOptionId.toString() : selectedService.id.toString() }
            onChange={handleChange}
            >
                <MenuItem value={defaultOptionId}>{defaultOption}</MenuItem>
                <MenuItem value={1}>Haircut</MenuItem>
                <MenuItem value={2}>Massage</MenuItem>
                <MenuItem value={3}>Facial</MenuItem>
                {/* Add more default values as needed */}
            </Select>
        </div>
    );
};

export default ServiceSelector;
