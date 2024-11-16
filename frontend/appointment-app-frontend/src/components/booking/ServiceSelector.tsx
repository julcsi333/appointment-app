import React, { useEffect, useState } from 'react';
import { InputLabel, Select, MenuItem, SelectChangeEvent, Typography, FormControl } from '@mui/material';
import { MainService, SubService } from '../api/model';
import { getServicesByProviderId, getSubServicesByMainServiceId } from '../api/services-api-call';

interface ServiceSelectorProps {
    id: number;
    prevSelectedService: MainService | undefined;
    prevSelectedSubService: SubService | undefined;
    services: MainService[];
    subservices: SubService[];
    onServiceSelect: (service: MainService) => void;
    onSubServiceSelect: (subService: SubService | undefined) => void;
}
const ServiceSelector: React.FC<ServiceSelectorProps> = ({ id, prevSelectedService, prevSelectedSubService, services, subservices, onServiceSelect, onSubServiceSelect }) => {

    return (
        <>
            <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                Select Service
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="service-select-label">Service</InputLabel>
                <Select
                labelId="service-select-label"
                value={prevSelectedService?.id || ''}
                onChange={(e) => onServiceSelect(services.find(s => s.id === e.target.value)!)}
                label="Service"
                >
                {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                    {service.globalService.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="subservice-select-label">Subservice</InputLabel>
            <Select
                labelId="subservice-select-label"
                value={prevSelectedSubService?.id || ''}
                onChange={(e) => onSubServiceSelect(subservices.find(s => s.id === e.target.value))}
                label="Subservice"
            >
                {subservices.map((subService) => (
                    <MenuItem key={subService.id} value={subService.id}>
                    {subService.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>


        </>
    );
};

export default ServiceSelector;
