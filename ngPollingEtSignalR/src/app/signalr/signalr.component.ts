import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { UselessTask } from '../models/UselessTask';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-signalr',
  standalone: true,
  imports: [MatCheckbox, MatCardContent, MatCard, MatFormField, FormsModule, MatLabel, CommonModule, MatInput, MatButtonModule],
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css']
})
export class SignalrComponent implements OnInit {

  private hubConnection?: signalR.HubConnection;
  usercount = 0;
  tasks: UselessTask[] = [];
  taskname: string = "";
  userCount: number = 0;

  ngOnInit(): void {
    this.connecttohub()
  }

  connecttohub() {
    // TODO On doit commencer par créer la connexion vers le Hub
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7289/taskHub')
      .build()

    // TODO On peut commencer à écouter pour les évènements qui vont déclencher des callbacks
    this.hubConnection!.on('TaskList', (data: UselessTask[]) => {
      console.log("======= TaskList =======");
      this.tasks = data
      console.log(data);
    });


    this.hubConnection!.on('UserCount', (data: number) => {
      console.log("======= UserCount =======");
      this.userCount = data
      console.log(data);
    });

    // TODO On doit ensuite se connecter
    this.hubConnection
      .start()
      .then(() => {
        console.log("La connexion est active!")
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  complete(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
    this.hubConnection!.invoke("CompleteTask", id).catch(err => console.error(err));
  }

  addtask() {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    this.hubConnection!.invoke("Add", this.taskname)
      .catch(err => console.error(err));
  }

}
