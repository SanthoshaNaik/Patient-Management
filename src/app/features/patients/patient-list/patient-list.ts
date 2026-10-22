import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-list',
  imports: [FormsModule],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList {
  patients: Patient[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      age: 35,
      gender: 'Male',
      phone: '9876543210',
      condition: 'General checkup'
    },
    {
      id: 2,
      name: 'Priya Nair',
      age: 28,
      gender: 'Female',
      phone: '9876543211',
      condition: 'Follow-up'
    },
    {
      id: 3,
      name: 'Arjun Kumar',
      age: 42,
      gender: 'Male',
      phone: '9876543212',
      condition: 'Consultation'
    }
  ];

  newPatient: Patient = this.getEmptyPatient();

  getEmptyPatient(): Patient {
    return {
      id: 0,
      name: '',
      age: 0,
      gender: '',
      phone: '',
      condition: ''
    };
  }

  addPatient() {
    const patient = {
      ...this.newPatient,
      id: this.patients.length > 0
        ? Math.max(...this.patients.map(patient => patient.id)) + 1
        : 1
    };

    this.patients.push(patient);
    this.newPatient = this.getEmptyPatient();
  }

  isEditing = false;

  editPatient(patient: Patient) {
    this.newPatient = { ...patient };
    this.isEditing = true;
  }

  updatePatient() {
    const index = this.patients.findIndex(
      patient => patient.id === this.newPatient.id
    );

    if (index !== -1) {
      this.patients[index] = { ...this.newPatient };
    }

    this.cancelEdit();
  }

  cancelEdit() {
    this.isEditing = false;
    this.newPatient = this.getEmptyPatient();
  }

  deletePatient(id: number) {
  const confirmed = confirm('Are you sure you want to delete this patient?');

  if (confirmed) {
    this.patients = this.patients.filter(
      patient => patient.id !== id
    );
  }
}
}