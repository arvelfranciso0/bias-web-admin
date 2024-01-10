import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
//const events = [{ title: "Meeting", start: new Date() }];
import { useState } from "react";
function Calendars(props) {
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (date) => {
    setDateRange((prevDateRange) => {
      // If the start date is not set, set it
      if (!prevDateRange[0]) {
        return [date, null];
      } else if (!prevDateRange[1]) {
        // If the end date is not set, set it
        return [prevDateRange[0], date];
      } else {
        // If both start and end dates are set, reset the range
        return [date, null];
      }
    });
  };

  // const [value, setValue] = useState(new Date());
  //   const events = [
  //     {
  //       title: "Meeting",
  //       start: new Date("October 14, 2023 21:52:34"),
  //       className: "bg-primary text-white",
  //     },
  //     {
  //       title: "Investment End",
  //       start: new Date("October 20, 2023 21:52:34"),
  //       className: "bg-secondary",
  //     },
  //   ];
  // function renderEventContent(eventInfo) {
  //   return (
  //     <>
  //       <b>{eventInfo.timeText}</b>
  //       <i>{eventInfo.event.title}</i>
  //     </>
  //   );
  // }
  //   const headerToolbar = {
  //     left: "prev,next",
  //     center: "title",
  //     right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  //   };
  const onChange = (data) => {
    console.log(data);
  };
  return (
    // <div>
    //   <FullCalendar
    //     plugins={[
    //       interactionPlugin,
    //       dayGridPlugin,
    //       timeGridPlugin,
    //       listPlugin,
    //       bootstrap5Plugin,
    //     ]}
    //     initialView="dayGridMonth"
    //     events={events}
    //     // eventContent={renderEventContent}
    //     themeSystem="bootstrap5"
    //     headerToolbar={headerToolbar}
    //     navLinks={true}
    //     eventColor="white"
    //     height={450}

    //   />
    // </div>
    // <div>
    //   <DateRangePicker
    //     initialSettings={{ startDate: "1/1/2014", endDate: "3/1/2014" }}
    //   >
    //     <button>Click Me To Open Picker!</button>
    //   </DateRangePicker>
    // </div>
    <div>
      <Calendar
        onChange={handleDateChange}
        value={dateRange.filter((date) => date !== null)}
        selectRange
      />
    </div>
  );
}

export default Calendars;
