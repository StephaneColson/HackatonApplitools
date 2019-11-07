/// <reference types="cypress" />
describe('Hackaton Applitools', () => {
    beforeEach(() => {
        cy.visit('/hackathonV2.html')
        cy.eyesOpen({appName: 'Hackaton AppliTools', batchName: 'Hackathon'})
    })
    afterEach(() => {
        cy.eyesClose()
    })
    describe('Login Page UI Elements Test', () => {
        it('should diplay the login page with all elements', () => {
            cy.eyesCheckWindow('Login page')
        })
    })

    describe('Login Data-Driven Test', () => {
        it('should show an error if no username and no password', () => {
            cy.get('#log-in').click();
            cy.eyesCheckWindow('Login with no username and no password')
        })

        it('should show an error if password is missing', () => {
            cy.get('#username').type('johnDoe')
            cy.get('#log-in').click();
            cy.eyesCheckWindow('Login with no password')
        })

        it('should show an error if username is missing', () => {
            cy.get('#password').type('1234')
            cy.get('#log-in').click();
            cy.eyesCheckWindow('Login with no username')
        })

        it('should log in if both username and password are filled', () => {
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()
            // Logged user visible
            cy.eyesCheckWindow('Logged in OK')
        })
    })

    describe('Logged in, Table Sort Test', () => {
        it('should display rows in ascending order', () => {
            // @Todo: Extract visit and login with an API call (login is already tested)
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()

            cy.eyesCheckWindow('Table before click on sort amount')
            cy.get('#amount').click() // Sort the table with amount column
            cy.eyesCheckWindow('Table after click on sort amount')
        })
    })

    describe('Logged in, Canvas Chart Test', () => {
        it('should display compare expenses bar', () => {
            // @Todo: Extract visit and login with a fast and stable API call (login doesn't need to be tested again here)
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()


            cy.get('#showExpensesChart').click()
            //assert that canvas is visible. Will be tested with visual testing
            cy.get('#canvas').should('be.visible')
            cy.eyesCheckWindow('Canvas with 2017 and 2018')

            // adds nextYear dataSet
            cy.get('#addDataset').click()
            // We just check that canvas is visible and that we can point in it
            cy.eyesCheckWindow('Canvas with 2017, 2018 and 2019 added')
        })
    })

    describe('Logged in, Dynamic Content Test', () => {
        it('should display the gif ads', () => {
            // @Todo: Extract visit and login with a fast and stable API call (login is already tested)
            cy.visit('/hackathonV2.html?showAd=true')
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()

            cy.eyesCheckWindow('2 adds in the page')
        })
    })
})

