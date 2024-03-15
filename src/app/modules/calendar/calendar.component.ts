import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
 
  currentDate: Date;
  selectedDate: Date;
  selectedDayBlock: HTMLElement | null;
  globalEventObj: any = {};
  monthName: string;
  yearNum: string;

  constructor() {
    this.currentDate = new Date();
    this.selectedDate = this.currentDate;
    this.selectedDayBlock = null;
    this.monthName = '';
    this.yearNum = '';
  }

  ngOnInit(): void {
    this.createCalendar(this.currentDate);
    this.showTodayDayName();
    this.setButtonClickListeners();
  }

  createCalendar(date: Date, side?: string): void {
    const currentDate = date;
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    this.monthName = currentDate.toLocaleString("en-US", { month: "long" });
    this.yearNum = currentDate.toLocaleString("en-US", { year: "numeric" });

    // Add animations
    this.addAnimationClasses(side);

    setTimeout(() => {
      // Clear the grid table
      this.clearGridTable();

      // Create calendar days
      this.createCalendarDays(startDate);

      // Add animations
      this.addAnimationClasses(side);
    }, side ? 270 : 0);
  }

  showTodayDayName(): void {
    const todayDayName = "Today is " + this.currentDate.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short"
    });
    document.getElementById("todayDayName")!.innerHTML = todayDayName;
  }

  setButtonClickListeners(): void {
    const prevButton = document.getElementById("prev");
    if (prevButton) {
      prevButton.addEventListener('click', () => this.changeMonthPrev());
    }

    const nextButton = document.getElementById("next");
    if (nextButton) {
      nextButton.addEventListener('click', () => this.changeMonthNext());
    }

    const changeFormButton = document.getElementById("changeFormButton");
    const addForm = document.getElementById("addForm");
    if (changeFormButton && addForm) {
      changeFormButton.addEventListener('click', () => addForm.style.top = "0");
    }

    const cancelAdd = document.getElementById("cancelAdd");
    if (cancelAdd) {
      cancelAdd.addEventListener('click', () => this.cancelAddClick());
    }
  }

  addAnimationClasses(side?: string): void {
    // Add animation classes to the grid table based on the side parameter
    const gridTable = document.getElementById("calendar-table");
    if (gridTable) {
      gridTable.className = side === 'left' ? "animated fadeOutRight" : "animated fadeOutLeft";
    }
  }

  clearGridTable(): void {
    // Clear the grid table
    const gridTable = document.getElementById("table-body");
    if (gridTable) {
      gridTable.innerHTML = '';
    }
  }

  createCalendarDays(startDate: Date): void {
    const gridTable = document.getElementById("table-body");
    if (!gridTable) return;

    let currentTr = document.createElement("div");
    currentTr.className = "row";
    gridTable.appendChild(currentTr);

    for (let i = 1; i < (startDate.getDay() || 7); i++) {
      let emptyDivCol = document.createElement("div");
      emptyDivCol.className = "col empty-day";
      currentTr.appendChild(emptyDivCol);
    }

    const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      if (currentTr.children.length >= 7) {
        currentTr = document.createElement("div");
        currentTr.className = "row";
        gridTable.appendChild(currentTr);
      }
      let currentDay = document.createElement("div");
      currentDay.className = "col";
      if (!this.selectedDayBlock && i === this.currentDate.getDate() || this.selectedDate.toDateString() === new Date(startDate.getFullYear(), startDate.getMonth(), i).toDateString()) {
        this.selectedDate = new Date(startDate.getFullYear(), startDate.getMonth(), i);
        document.getElementById("eventDayName")!.innerHTML = this.selectedDate.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
        this.selectedDayBlock = currentDay;
        setTimeout(() => {
          currentDay.classList.add("blue");
          currentDay.classList.add("lighten-3");
        }, 900);
      }
      currentDay.innerHTML = i.toString();

      // Show marks
      if (this.globalEventObj[new Date(startDate.getFullYear(), startDate.getMonth(), i).toDateString()]) {
        let eventMark = document.createElement("div");
        eventMark.className = "day-mark";
        currentDay.appendChild(eventMark);
      }

      currentTr.appendChild(currentDay);
    }

    for (let i = currentTr.children.length; i < 7; i++) {
      let emptyDivCol = document.createElement("div");
      emptyDivCol.className = "col empty-day";
      currentTr.appendChild(emptyDivCol);
    }
  }

  changeMonthPrev(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.createCalendar(this.currentDate, "left");
  }

  changeMonthNext(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.createCalendar(this.currentDate, "right");
  }

  cancelAddClick(): void {
    const addForm = document.getElementById("addForm");
    if (addForm) {
      addForm.style.top = "100%";
      const inputs = addForm.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }
      const labels = addForm.getElementsByTagName("label");
      for (let i = 0; i < labels.length; i++) {
        labels[i].className = "";
      }
    }
  }

  addEventButtonClick(): void {
    const title = (document.getElementById("eventTitleInput") as HTMLInputElement).value.trim();
    const desc = (document.getElementById("eventDescInput") as HTMLInputElement).value.trim();

    if (!title || !desc) {
      (document.getElementById("eventTitleInput") as HTMLInputElement).value = "";
      (document.getElementById("eventDescInput") as HTMLInputElement).value = "";
      const labels = document.getElementById("addForm")!.getElementsByTagName("label");
      for (let i = 0; i < labels.length; i++) {
        labels[i].className = "";
      }
      return;
    }

    this.addEvent(title, desc);
    this.showEvents();

    if (!this.selectedDayBlock!.querySelector(".day-mark")) {
      this.selectedDayBlock!.appendChild(document.createElement("div")).className = "day-mark";
    }

    const inputs = document.getElementById("addForm")!.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
    const labels = document.getElementById("addForm")!.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
      labels[i].className = "";
    }
  }

  addEvent(title: string, desc: string): void {
    if (!this.globalEventObj[this.selectedDate.toDateString()]) {
      this.globalEventObj[this.selectedDate.toDateString()] = {};
    }
    this.globalEventObj[this.selectedDate.toDateString()][title] = desc;
  }

  showEvents(): void {
    let sidebarEvents = document.getElementById("sidebarEvents");
    let objWithDate = this.globalEventObj[this.selectedDate.toDateString()];

    if (!sidebarEvents) return;

    sidebarEvents.innerHTML = "";

    if (objWithDate) {
      let eventsCount = 0;
      for (const key in this.globalEventObj[this.selectedDate.toDateString()]) {
        let eventContainer = document.createElement("div");
        eventContainer.className = "eventCard";

        let eventHeader = document.createElement("div");
        eventHeader.className = "eventCard-header";

        let eventDescription = document.createElement("div");
        eventDescription.className = "eventCard-description";

        eventHeader.appendChild(document.createTextNode(key));
        eventContainer.appendChild(eventHeader);

        eventDescription.appendChild(document.createTextNode(objWithDate[key]));
        eventContainer.appendChild(eventDescription);

        let markWrapper = document.createElement("div");
        markWrapper.className = "eventCard-mark-wrapper";
        let mark = document.createElement("div");
        mark.classList.add("eventCard-mark");
        markWrapper.appendChild(mark);
        eventContainer.appendChild(markWrapper);

        sidebarEvents.appendChild(eventContainer);

        eventsCount++;
      }
      let emptyFormMessage = document.getElementById("emptyFormTitle");
      if (emptyFormMessage) emptyFormMessage.innerHTML = `${eventsCount} events now`;
    } else {
      let emptyMessage = document.createElement("div");
      emptyMessage.className = "empty-message";
      emptyMessage.innerHTML = "Sorry, no events to selected date";
      if (sidebarEvents) sidebarEvents.appendChild(emptyMessage);
      let emptyFormMessage = document.getElementById("emptyFormTitle");
      if (emptyFormMessage) emptyFormMessage.innerHTML = "No events now";
    }
  }
}
