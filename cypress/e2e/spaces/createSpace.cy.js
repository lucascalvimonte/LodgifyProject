describe('Create and Manage Spaces via ClickUp API', () => {
    let spaceName
    let spaceId

    // Before all tests, create a workspace via the API
    before(() => {
        // Generate a unique space name using the timestamp and create the space
        cy.generateSpaceName().then((generatedSpaceName) => {
            spaceName = generatedSpaceName
            cy.createSpace(spaceName).then((newSpace) => {
                spaceId = newSpace.id
            })
        })
    })

    beforeEach(() => {
        // Generate a unique space name using the timestamp and create the space
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.loginUser()
    })

    // After all tests, clean up by deleting the created space
    after(() => {
        if (spaceId) {
            cy.deleteSpace(spaceId)
        }
    })

    it('should verify the new space in the UI', () => {
        cy.contains(spaceName, { timeout: 30000 }).should('exist')
    })

    it('should create a new task in the test space', () => {
        const folderName = `folder-${spaceName}`
        const taskName = `task-${spaceName}`
        cy.get(`[data-test="project-row__name__${spaceName}"]`, { timeout: 30000 }).click()
        cy.get(`[data-test="project-row__ellipsis_icon-${spaceName}"]`).click()
        cy.get('[data-pendo="cu-dropdown-list-item__id-new-folder"]').click()
        cy.get('[data-test="create-category__form-input"]').type(folderName)
        cy.get('[data-test="modal__body"]').find('button').contains('Create').click()
        cy.get('[data-test="views-bar__controller-row"]', { timeout: 30000 })
            .find('[data-test="create-task-menu__new-task-button"]')
            .click();
        cy.get('[data-test="draft-view__title-task"]').click()
        cy.get('[data-test="draft-view__title-task"]').type(taskName)
        cy.wait(2000)
        cy.get('[data-test="draft-view__quick-create-create"]').click()
        cy.wait(2000)

        cy.getFolder(spaceId, folderName)
            .then((folderId) => cy.getLists(folderId, folderName))
            .then((listId) => cy.getTask(listId, taskName))
    })


    it('should create task via API', () => {
    })
})