import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorType } from '../components/error/model';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { Availability, AvailabilityRule, AvailableEventData } from '../components/api/model';
import { getBaseUrl } from '../config/config';
import { createAvailability, createAvailabilityRule, deleteAvailability, getAvailabilityByProviderId } from '../components/api/provider-availability-api-call';

function createEventsFromAvailabilities(availabilities: Availability[]): AvailableEventData[] {
	const newEvents: AvailableEventData[] = [];
	availabilities.forEach(a => {
		newEvents.push({
			providerId: a.providerId, 
			start: a.start, 
			end: a.end, 
			id: a.id!,
			repeatEveryWeek: false,
			repeatMonthsCount: null,
			ruleId: a.ruleId,
			text: "Open for appointments"
		});
	});
	return newEvents;
}

const AvailabilityPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
    const [token, setToken] = useState<string>("");
	const [startDate, setStartDate] = useState<DayPilot.Date | undefined>(undefined);
	const [calendar, setCalendar] = useState<DayPilot.Calendar | null>(null);
	const [events, setEvents] = useState<AvailableEventData[]>([]);
    const {
		isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (id === undefined) {
					navigate(`/error`, {
						state: {
							errorType: ErrorType.PAGE_NOT_FOUND,
							providerId: id
						}
					});
				}
				if (isAuthenticated) {
					const accessToken = await getAccessTokenSilently();
					setToken(accessToken)
					const availabilities = await getAvailabilityByProviderId(Number(id))
					//console.log("new availabilities:" + JSON.stringify(availabilities))
					const newEvents = createEventsFromAvailabilities(availabilities)
					//console.log("new events:" + JSON.stringify(newEvents))
					setEvents(newEvents)
					
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		fetchData();
		return () => {

		};
	}, [getAccessTokenSilently, id, isAuthenticated, navigate]);

	const saveAvailabilityEvent = async (
		providerId: number, 
		start: DayPilot.Date,
		end: DayPilot.Date,
		repeatEveryWeek: boolean,
		repeatMonthsCount: number | null,
		text: string
	) => {
		if (repeatEveryWeek) {
			const newEvent: AvailabilityRule = {
				providerId: providerId, 
				start: start, 
				end: end, 
				id: null, 
				repeatEveryWeek: repeatEveryWeek,
				repeatMonthsCount: repeatMonthsCount
			}
			await createAvailabilityRule(newEvent, token)
			const newEvents = createEventsFromAvailabilities(await getAvailabilityByProviderId(Number(id)))
			setEvents(newEvents)
			//calendar!.events.list = newEvents
		} else {
			const availability: Availability = {
				providerId: providerId, 
				start: start, 
				end: end, 
				id: null, 
				ruleId: null
			}
			const newEvent = await createAvailability(availability, token)
			const newEventData: AvailableEventData = {
				providerId: providerId, 
				start: start, 
				end: end, 
				id: newEvent.id!,
				repeatEveryWeek: repeatEveryWeek,
				repeatMonthsCount: repeatMonthsCount,
				ruleId: null,
				text: text
			}
			//setEvents([...events, newEventData])
			calendar!.events.add(newEventData)
		}
	}

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
		timeFormat: 'Clock24Hours' as "Clock24Hours" | "Auto" | "Clock12Hours" | undefined,
		/*contextMenu: new DayPilot.Menu({
			items: [
				{
					text: "Delete",
					onClick: async args => {
						console.log('ARGS:')
						console.log(args)
						// TODO POPUP
						await deleteEvent(args.source.id)
						//calendar!.events.remove(args.source);
					},
				},
				{
					text: "-"
				},
				{
					text: "Edit...",
					onClick: async args => {
						await editEvent(args.source);
					}
				}
			]
		}),*/
		onBeforeEventRender: (args: DayPilot.CalendarBeforeEventRenderArgs) => {
			args.data.areas = [
				{
					top: 4,
					right: 4,
					width: 20,
					height: 20,
					html: `<img width="20" class="none" height="20" style="object-fit: 'fit'; overflow: hidden;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACEElEQVR4nO2YTUhVQRTHf738olQUw02CPBIRNATBhQs1LXCT7mwVRO1ci6ILNwa5dSHoRnAltghxEbWplWJQILUJQnlggraoqEQLP54MzOJyOL3eh8ydcH4wmzvnnPnfOzNnzlwIBAKBQOCC0gr0A1cKjNMF9ACXcchjIG3bOnA1zzgTkTivgQSO+B4Z2LT5PGLcAU5FnCSO2BADmzaQg3818Fn47wAlOOIWcCIEfAFqs/RfEr6ndj85ZUqZhZUs/O4rftPEQJHdwFLMoww+dcA3Yf8BKCMmbgA/haB9oEGxTdhMI22biJmHyiysKnl9VLF7gCcsKuJGIv3NwKHof4pHVAEpIfC3Pa1LgfeibxOoxDM6gWMh1AifFc/+AO14yqSylGQbxmOKgLUM4l8Cl/CcJPBLEb+bw0kdKx3AkfICWz5uXEk58CnDEvIqdWosZLGJTS3kJfcUscvAnnj2w5YgXnEd+CqEbtu6v0+5uLx1Wfv/C1OkvRICzV2hO2Izo8zOEzxhTBFnDrQoZbZsli95m5hps6VBVNg7oFixbVEKuh3gGjFhfqd8VOr7xgw+I8psPY/rdJ7L8Tb2t/2SBoZwzIAi4lmWvnVKxjqwdwYnlNi1K9dyTQ4xBpUP8AJH1CvZxPykKvTUTuEIeTkfzzNOBfAmEsekY6d1f6+tPAvNZHeBm+ekKxAIBAIB/ivOAM2OAh166TcAAAAAAElFTkSuQmCC" alt="Delete">`,
					action: "None",
					toolTip: "Delete event",
					onClick: async args => {
						await deleteAvailability(args.source.data.providerId, args.source.data.id, token)
						//setEvents([...events.filter(e => e.id !== args.source.data.id)])
						calendar!!.events.remove(args.source);
						console.log(args.source.data.id)
						console.log(events)
					}
				}/*,
				{
					top: 3,
					right: 25,
					width: 20,
					height: 20,
					symbol: "icons/daypilot.svg#x-circle",
					fontColor: "#fff",
					action: "None",
					toolTip: "Delete event",
					onClick: async args => {
						//calendar.events.remove(args.source);
					}
				}*/
			];

			//const participants = args.data.participants;
			args.data.areas.push({
				bottom: 5,
				right: 5, //+ i * 30,
				//width: 40,
				//height: 40,
				action: "None",
				html: `<img width="45" height="45" class="none" src="${getBaseUrl()}/users/${id!}/profile-picture" style="object-fit: 'fit'; border: 5px solid #fff; overflow: hidden; border-radius: 50%;" />`
				//image: `https://picsum.photos/24/24?random=${2}`,
				//image: `${getBaseUrl()}/users/${id!}/profile-picture`,
				//style: " .filled{ object-fit: 'contain'; }  ",
			});
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

	const editEvent = async (e: AvailableEventData) => {
		const modal = await DayPilot.Modal.prompt("Update event text:", e.text);
		if (!modal.result) { return; }
		e.text = modal.result;
		// TODO: handle event edit
		//calendar.events.update(e);
	};

	const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
		var formParams = [
			{name: "Start", id: "start", type: "time", timeFormat: "HH:mm", onValidate: validateStartDate},
			{name: "End", id: "end", type: "time", timeFormat: "HH:mm"},
			{name: "Repeat every week", id: "repeatWeekly", type: "checkbox",
				children: [
					{
						name: "Always update for the next", 
						id: "repeatMonths", 
						options: [
							{name: "3 months", id: "3"},
							{name: "6 months", id: "6"},
						]
					}
				]
			},
		];
		const form = await DayPilot.Modal.form(formParams, {start: args.start.toString("HH:mm"), end: args.end.toString("HH:mm")}, );
		calendar!.clearSelection();
		if (!form.result) { return; }

		const startTime: string[] = form.result.start.split(":");
		const endTime: string[] = form.result.end.split(":");
		
		const startDate = args.start.getDatePart().addHours(parseInt(startTime[0])).addMinutes(parseInt(startTime[1]));
		const endDate = args.start.getDatePart().addHours(parseInt(endTime[0])).addMinutes(parseInt(endTime[1]));

		await saveAvailabilityEvent(
				Number(id), 
				startDate, 
				endDate, 
				form.result.repeatWeekly,
				form.result.repeatMonths === undefined ? null : form.result.repeatMonths,
				"Open for appointments"
		)
	}

	return (
		<div>
			<GlobalToolbar />
				<Typography sx={{ p:2}} textAlign='center' variant='h4'>Availability calendar</Typography>
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
						onTimeRangeSelected={onTimeRangeSelected}
						controlRef={setCalendar}
						events={events}
						{...CalendarLocaleConfig}
					/>
				</Box>
			</Box>
		</div>
	);
};

export default AvailabilityPage;