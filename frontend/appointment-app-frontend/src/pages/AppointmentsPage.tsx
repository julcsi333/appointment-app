import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorType } from '../components/error/model';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { Appointment, AppointmentEvent, Availability, AvailabilityRule, AvailableEventData, User } from '../components/api/model';
import { getBaseUrl } from '../config/config';
import { getUserByExternalId } from '../components/api/user-api-call';
import { deleteAppointment, getAppointments, getHostedAppointments, modifyAppointment } from '../components/api/appointment-api-call';
import { getProvider } from '../components/api/provider-api-call';
import dayjs from 'dayjs';

function createEventsFromAppointments(appointments: Appointment[], host: boolean): AppointmentEvent[] {
	const newEvents: AppointmentEvent[] = [];

	appointments.forEach(a => {
		const date = new DayPilot.Date(a.date.toString())
		const start: string[] = a.startTime.toString().split(":");
		const end: string[] = a.endTime.toString().split(":");

		newEvents.push({
			providerId: a.providerId,
			customerId: a.customerId,
			subServiceId: a.subServiceId,
			start: date.addHours(Number(start[0])).addMinutes(Number(start[1])), 
			end: date.addHours(Number(end[0])).addMinutes(Number(end[1])),
			id: a.id!,
			text: a.subServiceName!,
			host: host,
		});
	});
	return newEvents;
}

const AppointmentsPage: React.FC = () => {
	const navigate = useNavigate();
    const [token, setToken] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<User>();
    const [provider, setProvider] = useState<boolean>();
	const [startDate, setStartDate] = useState<DayPilot.Date | undefined>(undefined);
	const [calendar, setCalendar] = useState<DayPilot.Calendar | null>(null);
	const [events, setEvents] = useState<AppointmentEvent[]>([]);
    const {
		isAuthenticated,
		user,
        getAccessTokenSilently
    } = useAuth0();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (isAuthenticated) {
					const accessToken = await getAccessTokenSilently();
					setToken(accessToken)
					const u = await getUserByExternalId(user!.sub!, accessToken)
					setCurrentUser(u)
					const p = await getProvider(u.id.toString())


					const appointments = createEventsFromAppointments(await getAppointments(u.id), false)
					let hostedAppointments: AppointmentEvent[] = []
					if (p !== null) {
						setProvider(true)
						hostedAppointments = createEventsFromAppointments(await getHostedAppointments(u.id), true)
					}
					setEvents([...appointments, ...hostedAppointments])
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		fetchData();
		return () => {

		};
	}, [getAccessTokenSilently, isAuthenticated, user]);

	/*const deleteEvent = async (eventId: number) => {
		let event = events.find(event => event.id === eventId)
		console.log("afsda")
		if (event) {
			await deleteAvailability(event.providerId, Number(event.id), token)
		} else {
			console.error(`Event with id ${eventId} not found!`)
		}
		
		//setEvents([...events.filter(e => e.id !== args.source.id)])
	}*/

	const CalendarLocaleConfig = {
		weekStarts: 1,
		headerDateFormat: 'dddd (MM.dd.)',
		durationBarVisible: false,
		timeFormat: 'Clock24Hours' as "Clock24Hours" | "Auto" | "Clock12Hours" | undefined,
		onEventClick: async (args: any) => {
			await editEvent(args.e);
		},
		onBeforeEventRender: (args: DayPilot.CalendarBeforeEventRenderArgs) => {
			args.data.areas = [
				{
					top: 2,
					right: 2,
					width: 20,
					height: 20,
					html: `<img width="20" class="none" height="20" style="object-fit: 'fit'; overflow: hidden;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACEElEQVR4nO2YTUhVQRTHf738olQUw02CPBIRNATBhQs1LXCT7mwVRO1ci6ILNwa5dSHoRnAltghxEbWplWJQILUJQnlggraoqEQLP54MzOJyOL3eh8ydcH4wmzvnnPnfOzNnzlwIBAKBQOCC0gr0A1cKjNMF9ACXcchjIG3bOnA1zzgTkTivgQSO+B4Z2LT5PGLcAU5FnCSO2BADmzaQg3818Fn47wAlOOIWcCIEfAFqs/RfEr6ndj85ZUqZhZUs/O4rftPEQJHdwFLMoww+dcA3Yf8BKCMmbgA/haB9oEGxTdhMI22biJmHyiysKnl9VLF7gCcsKuJGIv3NwKHof4pHVAEpIfC3Pa1LgfeibxOoxDM6gWMh1AifFc/+AO14yqSylGQbxmOKgLUM4l8Cl/CcJPBLEb+bw0kdKx3AkfICWz5uXEk58CnDEvIqdWosZLGJTS3kJfcUscvAnnj2w5YgXnEd+CqEbtu6v0+5uLx1Wfv/C1OkvRICzV2hO2Izo8zOEzxhTBFnDrQoZbZsli95m5hps6VBVNg7oFixbVEKuh3gGjFhfqd8VOr7xgw+I8psPY/rdJ7L8Tb2t/2SBoZwzIAi4lmWvnVKxjqwdwYnlNi1K9dyTQ4xBpUP8AJH1CvZxPykKvTUTuEIeTkfzzNOBfAmEsekY6d1f6+tPAvNZHeBm+ekKxAIBAIB/ivOAM2OAh166TcAAAAAAElFTkSuQmCC" alt="Delete">`,
					action: "None",
					toolTip: "Cancel appointment",
					onClick: async args => {
						await deleteAppointment(args.source.data.id, !args.source.data.host, token)
						calendar!!.events.remove(args.source);
					}
				}
			];
			
			const appointmentEvent: AppointmentEvent = args.data as AppointmentEvent
			args.data.backColor = appointmentEvent.host ? '#2e78d6' : '#999999'
			args.data.areas.push(
				{
					bottom: 4,
					right: 20,
					onClick: () => {navigate(`/profile/${appointmentEvent.customerId}`)},
					action: "None",
					html: `<img width="20" height="20" class="none" src="${getBaseUrl()}/users/${appointmentEvent.customerId}/profile-picture" style="object-fit: 'fit'; border: 5px solid #fff; overflow: hidden; border-radius: 50%;" />`
				},
				{
					bottom: 4,
					right: 55,
					onClick: () => {navigate(`/profile/${appointmentEvent.providerId}`)},
					action: "None",
					html: `<img width="20" height="20" class="none" src="${getBaseUrl()}/users/${appointmentEvent.providerId!}/profile-picture" style="object-fit: 'fit'; border: 5px solid #fff; overflow: hidden; border-radius: 50%;" />`
				}
			);

			//args.data.areas.push();
		}
    };

	const validateStartDate = (args: DayPilot.ModalFormItemValidationArgs) => {
		// TODO: Some validation here
		var value = args.value || "";
		if (value === "") {
			args.valid = false;
			args.message = "Start date can't be empty.";
			return;
		}
		/*if(new DayPilot.Date(value) < DayPilot.Date.today()) {
			args.valid = false;
			args.message = "Start date can't be earlier than today.";
			return;
		}*/
	}

	const editEvent = async (e: AppointmentEvent) => {
		if (!e.host) {
			return;
		}
		var formParams = [
			{name: "Start", id: "start", type: "time", timeFormat: "HH:mm", onValidate: validateStartDate},
			{name: "End", id: "end", type: "time", timeFormat: "HH:mm"}
		];
		const form = await DayPilot.Modal.form(formParams, {start: e.start.toString("HH:mm"), end: e.end.toString("HH:mm")}, );
		if (!form.result) { return; }
		const startTime: string[] = form.result.start.split(":");
		const endTime: string[] = form.result.end.split(":");
		e.start = e.start.getDatePart().addHours(parseInt(startTime[0])).addMinutes(parseInt(startTime[1]));
		e.end = e.start.getDatePart().addHours(parseInt(endTime[0])).addMinutes(parseInt(endTime[1]));
		await modifyAppointment({
			id: Number(e.id),
			customerId: e.customerId,
			providerId: e.providerId,
			subServiceId: e.subServiceId,
			startTime: dayjs().set('hour', parseInt(startTime[0])).set('minute', parseInt(startTime[1])),
			endTime: dayjs().set('hour', parseInt(endTime[0])).set('minute', parseInt(endTime[1])),
			date: dayjs(e.start.getDatePart().toString()),
			subServiceName: e.text
		}, token)
		calendar!.events.update(e)

		// TODO: handle event edit
		//calendar.events.update(e);
	};

	return (
		<div>
			<GlobalToolbar />
				<Typography sx={{ p:2}} textAlign='center' variant='h4'>My Appointments</Typography>
			<Box sx={{ p: 2, display:'flex' }}>
				<Box sx={{ml:5, mr:5}}>
					<DayPilotNavigator 
						selectMode='Week' 
						selectionDay={startDate}
						onTimeRangeSelected={(args) => setStartDate(args.day)}
						weekStarts={1}
					/>
				</Box>
				<Box sx={{flexGrow:1}}>
					<DayPilotCalendar 
						eventMoveHandling='Disabled'
						viewType='Week'
						startDate={startDate}
						cellHeight={42}
						controlRef={setCalendar}
						events={events}
						{...CalendarLocaleConfig}
					/>
				</Box>
			</Box>
		</div>
	);
};

export default AppointmentsPage;