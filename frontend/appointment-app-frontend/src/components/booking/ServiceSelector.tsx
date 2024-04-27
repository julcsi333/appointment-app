import React from 'react';
import { InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface ServiceSelectorProps {
  onServiceSelect: (service: string) => void;
  selectedService: string | null;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect, selectedService }) => {
    const defaultOption = "Select an option";
    const handleChange = (event: SelectChangeEvent<string>) => {
        const service = event.target.value;
        if (service !== defaultOption) {
            onServiceSelect(service); // Update the selected service when dropdown value changes
        }
    };

    return (
        <div>
            <InputLabel id="service-select-label">Select Service</InputLabel>
            <Select
            labelId="service-select-label"
            id="service-select"
            value={selectedService === null ? defaultOption : selectedService }
            onChange={handleChange}
            >
                <MenuItem value={defaultOption}>{defaultOption}</MenuItem>
                <MenuItem value="Haircut">Haircut</MenuItem>
                <MenuItem value="Massage">Massage</MenuItem>
                <MenuItem value="Facial">Facial</MenuItem>
                {/* Add more default values as needed */}
            </Select>
        </div>
    );
};

export default ServiceSelector;
