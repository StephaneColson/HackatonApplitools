/// <reference types="cypress" />

describe('Login Page UI Elements Test', () => {
    it('should diplay the login page with all elements', () => {
        cy.visit('/hackathon.html')
    
        // Check all logos, pictures
        cy.get('.logo-w > a > img').should('be.visible')
        cy.get(':nth-child(1) > .pre-icon').should('be.visible')
        cy.get(':nth-child(2) > .pre-icon').should('be.visible')
        cy.get('[style="display: inline-block; margin-bottom:4px;"] > img').should('be.visible')
        cy.get(':nth-child(2) > img').should('be.visible')
        cy.get(':nth-child(3) > img').should('be.visible')
    
        // Check all abels
        cy.get('.auth-header').should('contain.text', 'Login Form')
        cy.get(':nth-child(1) > label').should('have.text', 'Username')
        cy.get('form > :nth-child(2) > label').should('have.text', 'Password')
    
        cy.get('.form-check-label').should('have.text','Remember Me')
    
        // Check that checkbox exists and not checked
        cy.get('.form-check-input').should('be.visible').and('not.be.checked')
    
        // Check button name
        cy.get('#log-in').should('have.text', 'Log In')

        // Check text input
        cy.get('#username').should('be.enabled').and('be.empty')
        cy.get('#password').should('be.enabled').and('be.empty')
    })
})

describe('Login Data-Driven Test', () => {
    it('should show an error if no username and no password', () => {
        cy.visit('/hackathon.html')

        cy.get('#log-in').click();
        // because there's a randoom id here, I use the class path
        cy.get('.alert.alert-warning').should('contain.text','Both Username and Password must be present')
    })

    it('should show an error if password is missing', () => {
        cy.visit('/hackathon.html')

        cy.get('#username').type('johnDoe')

        cy.get('#log-in').click();
        // because there's a randoom id here, I use the class path
        cy.get('.alert.alert-warning').should('contain.text','Password must be present')
    })

    it('should show an error if username is missing', () => {
        cy.visit('/hackathon.html')

        cy.get('#password').type('1234')

        cy.get('#log-in').click();
        // because there's a randoom id here, I use the class path
        cy.get('.alert.alert-warning').should('contain.text','Username must be present')
    })

    it('should log in if both username and password are filled', () => {
        cy.visit('/hackathon.html')
        cy.get('#username').type('johnDoe')
        cy.get('#password').type('1234')

        cy.get('#log-in').click()
        // Redirected to https://demo.applitools.com/hackathonApp.html
        cy.url().should('eq','https://demo.applitools.com/hackathonApp.html')
    })
})

describe('Logged in, Table Sort Test', () => { // @TODO Assertions missing
    it('should display rows in ascending order', () => {
    // @Todo: Extract visit and login with a fast and stable API call (login is already tested)
        cy.visit('/hackathon.html')
        cy.get('#username').type('johnDoe')
        cy.get('#password').type('1234')
        cy.get('#log-in').click()

        //Create a 2 dimension array to store all rows and 2 columns of Transaction Table content
        var transactionNotSorted = new Array(7) // 6 rows (ok for this exercise)
        for (var row = 0; row < transactionNotSorted.length; row++) {
            transactionNotSorted[row] = new Array(2) // only 2 columns (desc and amount)

        }

        //Create a 2 dimension array to store all rows and 2 columns of Transaction Table content
        var transactionSorted = new Array(7) // 6 rows (ok for this exercise)
        for (var row = 0; row < transactionSorted.length; row++) {
            transactionSorted[row] = new Array(2) // only 2 columns (desc and amount)

        }

        // fill the 2 dimension array with content of transaction table (only Desc and amount column)
        cy.get('#transactionsTable').within(() => {
            for (var row = 1; row < 7; row++) {// starts from 1 to avoid titles
                cy.get('tr').eq(row).within(() => {
                    cy.get('.cell-with-media').invoke('text').then((text1) => {
                        console.log("desc: " +text1)
                        transactionNotSorted[row-1][0] = text1
                    })

                    cy.get('.text-right').invoke('text').then((text2) => {
                        console.log("Amount: " +text2)
                        transactionNotSorted[row-1][1] = text2
                    })
                })
            }
        })

        cy.get('#amount').click() // Sort the table with amount column
        cy.get('#transactionsTable').within(() => {
            for (var row = 1; row < 7; row++) {// starts from 1 to avoid titles
                cy.get('tr').eq(row).within(() => {
                    cy.get('.cell-with-media').invoke('text').then((text1) => {
                        console.log("desc: " +text1)
                        transactionSorted[row-1][0] = text1
                    })

                    cy.get('.text-right').invoke('text').then((text2) => {
                        console.log("Amount: " +text2)
                        transactionSorted[row-1][1] = text2
                    })
                })
            }
        })
        // @TODO: Reste à vérifier que c'est bien classé en ascendant et que les données sont correctes
    })
})

describe('Logged in, Canvas Chart Test', () => {
    it('should display compare expenses bar', () => {
        // @Todo: Extract visit and login with a fast and stable API call (login is already tested)
            cy.visit('/hackathon.html')
            cy.get('#username').type('johnDoe')
            cy.get('#password').type('1234')
            cy.get('#log-in').click()  

            cy.get('#showExpensesChart').click()
            //assert that canvas is visible. Will be tested with visual testing
            cy.get('#canvas').should('be.visible')

            // adds nextYear dataSet
            cy.get('#addDataset').click()
            //@What can be asserted here except that canvas is still visible
            cy.get('#canvas')
                .should('be.visible')
                .trigger('pointerdown','center')
    })
})

describe('Logged in, Dynamic Content Test', () => {
    it('should display the gif ads', () => {
        // @Todo: Extract visit and login with a fast and stable API call (login is already tested)
        cy.visit('/hackathon.html?showAd=true')
        cy.get('#username').type('johnDoe')
        cy.get('#password').type('1234')
        cy.get('#log-in').click()

        cy.get('#flashSale > img').should('be.visible')
        cy.get('#flashSale2 > img').should('be.visible')
    })
})

