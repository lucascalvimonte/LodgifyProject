// Generate a unique space name using the current timestamp
Cypress.Commands.add('generateSpaceName', () => {
    const timestamp = Date.now()
    const spaceName = `workSpace${timestamp}`
    cy.log(spaceName)
    return cy.wrap(spaceName)
})

// Log in to the ClickUp web application
Cypress.Commands.add('loginUser', () => {
    const emailUser = Cypress.env('email')
    const passwordUser = Cypress.env('password')
    cy.visit('/')
    cy.get('[data-test="login-email-input"]').type(emailUser)
    cy.get('[data-test="login-password-input"]').type(passwordUser)
    cy.get('[data-test="login-submit"]').click()
})

// Create a new workspace in ClickUp via the API
Cypress.Commands.add('createSpace', (spaceName) => {
    const apiToken = Cypress.env('apiToken')
    // Get the team ID where the space will be created
    cy.request({
        method: 'GET',
        url: 'https://api.clickup.com/api/v2/team',
        headers: {
            'Authorization': `${apiToken}`
        }
    }).then((response) => {
        // Extract the team ID from the response
        const teamId = response.body.teams[0].id
        cy.wrap(teamId).as('teamId')

        // Use the team ID to create a new space
        cy.get('@teamId').then((teamId) => {
            cy.request({
                method: 'POST',
                url: `https://api.clickup.com/api/v2/team/${teamId}/space`,
                headers: {
                    'Authorization': `${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    "name": spaceName,
                    "multiple_assignees": true
                }
            }).then((response) => {
                expect(response.status).to.eq(200)
                cy.wrap(response.body).as('newSpace')
            })
        })
    })
})

// Delete a space in ClickUp via the API using the space ID
Cypress.Commands.add('deleteSpace', (spaceId) => {
    const apiToken = Cypress.env('apiToken')

    cy.request({
        method: 'DELETE',
        url: `https://api.clickup.com/api/v2/space/${spaceId}`,
        headers: {
            'Authorization': `${apiToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        cy.log(`Space with ID: ${spaceId} deleted successfully`)
    })
})

// Command to get the folder ID from a space using the folder name
Cypress.Commands.add('getFolder', (spaceId, nameFolder) => {
    const apiToken = Cypress.env('apiToken')

    return cy.request({
        method: 'GET',
        url: `https://api.clickup.com/api/v2/space/${spaceId}/folder`,
        headers: {
            'Authorization': `${apiToken}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        const folder = response.body.folders.find(f => f.name === nameFolder)
        if (folder) {
            cy.log(`Folder found: ${folder.name} with ID: ${folder.id}`)
            cy.wrap(folder.id).as('folderId')
        } else {
            throw new Error(`Folder with name ${nameFolder} not found.`)
        }
    })
})

// Command to get the list ID from a folder using the folder ID and name
Cypress.Commands.add('getLists', (folderId, nameFolder) => {
    const apiToken = Cypress.env('apiToken')

    return cy.request({
        method: 'GET',
        url: `https://api.clickup.com/api/v2/folder/${folderId}/list`,
        headers: {
            'Authorization': `${apiToken}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        const lists = response.body.lists.find(l => l.folder.name === nameFolder)
        if (lists) {
            cy.log(`List found: ${lists.name} with ID: ${lists.id}`)
            cy.wrap(lists.id).as('listId')
        } else {
            throw new Error(`Folder with name ${nameFolder} not found.`)
        }
    })
})

// Command to get the task ID from a list using the task name
Cypress.Commands.add('getTask', (listId, taskName) => {
    const apiToken = Cypress.env('apiToken')

    return cy.request({
        method: 'GET',
        url: `https://api.clickup.com/api/v2/list/${listId}/task`,
        headers: {
            'Authorization': `${apiToken}`,
        }
    }).then((response) => {
        expect(response.status).to.eq(200)

        const task = response.body.tasks.find(t => t.name === taskName)
        if (task) {
            cy.log(`Task found: ${task.name} with ID: ${task.id}`)
        } else {
            throw new Error(`Task with name "${taskName}" not found.`)
        }
    })
})