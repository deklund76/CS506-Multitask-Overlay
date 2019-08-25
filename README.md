# Background
This application was completed for CS 506-Software Engineering at the University of Wisconsin-Madison in Spring 2019. Contributers include: Matt Patek, Nina Nguyen, Devin Samaranayake, Drew Eklund, and Chamath Gunawardena.

# Getting Started
Install dependencies by accessing the root folder and running `npm install`. Change to the **App** directory and run `npm install` again. Yes, both of these are necessary. See instructions below for running the **Main App** and the  **Background Process**.
****MUST BE USING WINDOWS TO RUN BACKGROUND PROCESS****
To install run these commands from an Administrative Powershell:
npm install -g node-gyp
npm install --global --production windows-build-tools

</br>

# Components
This software project is broken down into three main software components:
* Main App
* Overlay
* Background Process

### Main App
The **Main App** allows a user to configure settings for the overlay. It also allows a user to view overlay presets. The **Main App** will be developed using a **Model-View-Controller** system architecture. It will leverage the Electron framework and is developed in Javascript, HTML, and CSS.

To run the **Main App**, change to the App directory using `cd App`. Then execute `npm start`.

### Overlay
The **Overlay** can be triggered through a key-combo and provides the user with widgets they can interact with. These are configured in the main app and can be placed at specific locations in the screen. The size and location can be configured. The **Overlay** may leverage proprietary or open-source APIs for the widgets.

At this point, the **Overlay** is not runnable.

### Background Process
The **Background Process** manages the **Main App** and widgets threads. It is in charge of spinning up the **Main App** and each individual widget in the **Overlay**. It may also be in charge of communicating with external apps for the widgets, but this is TBD. It will be developed in C.

To run the program with the background process, you will need to have Microsoft Visual Studio 2017 and the Visual Studios Build Tools.




The reason you have to go through so much to run the background process is because most of the group's laptops don't use Windows, so for them to code we had to make a separate main.js file, that they could still run to debug their code.


</br>

# Testing
Testing will be split into unit tests, integration tests, and system tests. For the **Main App** and **Overlay**, unit testing will utilize Mocha and Chai. Those will use Cucumber features and Chai for integration and system tests. System tests may also utilize Spectron for UI automation. Testing for the **Background Process** is still TBD.

These test should be developed **as features are being developed**. Unit tests should be developed whenever a module is implemented, while integration and system tests can be written proactively. With Cucumber, we can write tests in plain English and they do not need step definitions until we have the ability to run such tests. Because of this, integration and system tests can be written out before the capabilities of those features are even close to done.

### Unit Testing
These tests will appear under `test/spec`. Naming convention will be `<featureName>-spec.js`. These tests will be outlined using Mocha and assertions/validation steps will be done with Chai.

For the **Main App**, change to the App directory using `cd App`. Then execute `npm run unit`.

### Integration and System Testing
These tests will appear under `test/test`. The tests will be split between `test/test/features` and `test/test/support`. The former will contain Cucumber feature files while the latter will contain step definitions and other logic needed for the tests.

</br>

# Pipeline and CI/CD
CI/CD pipelines will run whenever code is pushed to a branch, and scheduled jobs can be setup to run nightly regression tests.

#### Branch pushes (non-master):
```
linting => unit tests => integration tests => system tests
```
For a push to a branch that is not master, the first stage will be a code and Gherkin lint. This ensures that the code and Cucumber feature files are properly formatted. Then unit, integration, and system tests will be run for the respective software component. For example, for a branch pertaining to the Main App, tests will only run for the Main App, not the other components. In order for this to work correctly, branches *must be properly named*.

Branch naming rules:
* Main App: `app-(.*)`
* Overlay: `overlay-(.*)`
* Background Process: `background-(.*)`
* Hybrid: `hybrid-(.*)`

If none of the above are specified, the pipeline *will not run*. Note that hybrid will run tests for all three software components.

#### Merge to master:
```
unit tests => integration tests => system tests => orchestrated tests
```
This pipeline will be similar to the branch pushes, except tests will be run on all 3 software components. Additionally, orchestrated tests will also be run.

#### Nightly regression:
```
build image => unit tests => integration tests => system tests => orchestrated tests
```
The build image stage will be a simple test making sure a docker image can be built with the code. Then unit, integration, and system tests will be run, broken down by software component (Main App, Overlay, Background Process). Finally, orchestrated tests will be run, which will be similar to the system tests but will test the project as a whole.

</br>
