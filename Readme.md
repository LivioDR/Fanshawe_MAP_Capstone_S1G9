# INFO-6134 - Capstone Project
## Group S1G9
- Kaleb Jubar
- Kristian Kerrigan
- Aggrey Nhiwatiwa
- Livio Reinoso
---
# Project Details
## \<yourappname here\>
### Description
\<yourappname here\> is an all-in-one employee portal and HR tool for companies of all sizes. Your HR team can set up internal accounts for all employees that allow them to clock in and out, view their PTO and sick leave status, request time off, check the company's management hierarchy, see benefits information, and much more! HR personnel and administrators can manage employee account status and available employee benefits, and in future updates will be able to customize things like PTO accrual and overtime more granularly.
### Data Source
This app uses Firebase Firestore for storing all app-related information, such as employee details and company-wide information (e.g. benefits). To control and secure access to employee and company data, the app will integrate with Firebase Authentication for account and role management, ensuring only appropriate users have access to sensitive information.

Upon signing up to use the app, client companies will be provided one or more administrator accounts with credentials, as well as the ability to change the passwords for admin accounts. From there, administrators will be able to create accounts for HR personnel and employees, who will then have the ability to change their password as desired. This ensures a smooth and unified process for employee account creation that doesn't require interaction from the account holders, thereby minimizing risk of issues like typos or incorrectly-entered information.
### App Features
#### Kaleb
- Users can clock in and out, or for salaried employees, set regular working hours
- Users can see the current clocked-in/-out status of other employees
- Users can select the language to use for the app (will include English and Spanish to start)
- Users will see an animated splash screen while the app content is loading
  
#### Kristian
- Users can add to and view a list of emergency contacts
- Users can see a list of their current insurance and benefits
- Users can choose a subscription payment model for the app 
- Users can pay their subscription via Stripe integration
  
#### Aggrey
- Authenticated users can login to the app and registered users can request a password reset email link
- Users have access to different information levels, and permissions (such as read/write or read only) depending on their role
- Admin and Manager users can set the PTO for each user in their company
- A trial mode will be available, with the purpose of demonstrating the app to potential new companies. Employees of a company in trial mode will have limited time access to the app, with the option of converting the existing trial membership into a full membership, carrying over data from the trial
  
#### Livio
- Users can see and update their profile. Admins can see all profiles under their company
- Admin users can add members to their organization and enable/disable/delete them
- Users can request PTO and sick days, and check remaining days as well
- Users can select between light and dark mode, with a system default value