import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalToolbar from '../components/GlobalToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorType } from '../components/error/model';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { AvailableEvent, AvailableEventData } from '../components/api/model';
import PhoneIcon from '@mui/icons-material/Phone';
import { getBaseUrl } from '../config';


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
		providerId: string, 
		start: DayPilot.Date,
		end: DayPilot.Date,
		repeatEveryWeek: boolean,
		repeatMonthsCount: number | null,
		text: string
	) => {
		const newEvent: AvailableEvent = /*TODO: replace this with backend call*/{
			providerId: id!, 
			start: start, 
			end: end, 
			id: null, 
			repeatEveryWeek: repeatEveryWeek,
			repeatMonthsCount: repeatMonthsCount
		} 
		const newEventData: AvailableEventData = {
			providerId: id!, 
			start: start, 
			end: end, 
			id: DayPilot.guid(),// TODO: newEvent.id!, 
			repeatEveryWeek: repeatEveryWeek,
			repeatMonthsCount: repeatMonthsCount,
			text: text
		}
		setEvents([...events, newEventData])
		// TODO: backend call, return id of event
	}

	const CalendarLocaleConfig = {
		weekStarts: 1,
		headerDateFormat: 'dddd (MM.dd.)',
		timeFormat: 'Clock24Hours' as "Clock24Hours" | "Auto" | "Clock12Hours" | undefined,
		contextMenu: new DayPilot.Menu({
			items: [
				{
					text: "Delete",
					onClick: async args => {
						console.log(args)
						//setEvents([...events.filter(e => e.id !== args.source.id)])
						// TODO: call backend
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
		}),
		onBeforeEventRender: (args: DayPilot.CalendarBeforeEventRenderArgs) => {
			args.data.areas = [
				/*{
					top: 3,
					right: 3,
					width: 20,
					height: 20,
					symbol: "icons/daypilot.svg#minichevron-down-2",
					fontColor: "#fff",
					toolTip: "Show context menu",
					action: "ContextMenu",
				},
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
				id!, 
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