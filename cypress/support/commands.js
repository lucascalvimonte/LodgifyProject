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

Cypress.Commands.add('createTaskViaAPI', (listId, taskName) => {
    const apiToken = Cypress.env('apiToken');

    return cy.request({
        method: 'POST',
        url: `https://api.clickup.com/api/v2/list/${listId}/task`,
        headers: {
            'Authorization': `${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: {
            "name": taskName,
            "description": "Test task created via API",
            "assignees": [],
            "tags": [],
            "status": "to do",
            "priority": 3,
            "due_date": null,
            "start_date": null,
            "notify_all": true,
            "parent": null,
            "links_to": null,
            "check_required_custom_fields": true
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        cy.log(`Task "${taskName}" created via API with ID: ${response.body.id}`);
        cy.wrap(response.body).as('createdTask');
    });
});

// Creates a new folder in the test space via the UI
Cypress.Commands.add('createNewFolderInTheTestSpace', (spaceName, folderName) => {
    cy.get(`[data-test="project-row__name__${spaceName}"]`, { timeout: 10000 }).click()
    cy.get(`[data-test="project-row__ellipsis_icon-${spaceName}"]`).click()
    cy.get('[data-pendo="cu-dropdown-list-item__id-new-folder"]').click()
    cy.get('[data-test="create-category__form-input"]').type(folderName)
    cy.get('[data-test="modal__body"]').find('button').contains('Create').click()
})

// Creates a new task inside the folder via the UI
Cypress.Commands.add('createNewTaskInTheFolder', (taskName) => {
    cy.get('[data-test="views-bar__controller-row"]', { timeout: 30000 })
        .find('[data-test="create-task-menu__new-task-button"]')
        .click();
    cy.get('[data-test="draft-view__container"]').should('be.visible')
    cy.get('[data-test="draft-view__title-task"]').click()
    cy.get('[data-test="draft-view__title-task"]').type(taskName)
    cy.get('[data-test="draft-view__quick-create-create"]').click()
})

// Verifies that the task was successfully created via the API
Cypress.Commands.add('verifyTaskWasCreatedSuccessfully', (spaceId, folderName, taskName) => {
    cy.getFolder(spaceId, folderName)
        .then((folderId) => cy.getLists(folderId, folderName))
        .then((listId) => cy.getTask(listId, taskName))
})

Cypress.Commands.add('validateTaskCreatedViaUI', (spaceName, spaceId, folderName, newTask) => {
    cy.getFolder(spaceId, folderName)
        .then((folderId) => cy.getLists(folderId, folderName))
        .then((listId) => cy.createTaskViaAPI(listId, newTask))
})

Cypress.Commands.add('validatTaskWasCreatedViaUI', (spaceName, folderName, newTask) => {
    cy.get(`[data-test="project-row__name__${spaceName}"]`, { timeout: 10000 }).click()
    cy.get(`[data-test="category-row__folder-name__${folderName}"]`).click()
    cy.get('[data-test="sidebar-flat-tree__item-name-List"]').click()
    cy.get(`[data-test="task-row-main__${newTask}"]`).should('be.visible')
})