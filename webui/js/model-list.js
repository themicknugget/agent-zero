// Model list management for settings
document.addEventListener('alpine:init', function () {
    Alpine.data('modelListManager', function () {
        return {
            // Initialize with empty lists
            chat_models: [],
            util_models: [],
            embed_models: [],
            browser_models: [],
            
            // Track which model list is being edited
            currentModelType: null,
            
            // Track if the model list editor is open
            isModelListEditorOpen: false,
            
            // Initialize from settings
            init() {
                // Watch for settings updates
                document.addEventListener('settings-updated', (event) => {
                    this.updateModelLists(event.detail);
                });
            },
            
            // Update model lists from settings
            updateModelLists(settings) {
                this.chat_models = settings.chat_models || [];
                this.util_models = settings.util_models || [];
                this.embed_models = settings.embed_models || [];
                this.browser_models = settings.browser_models || [];
            },
            
            // Open the model list editor
            openModelListEditor(modelType) {
                this.currentModelType = modelType;
                this.isModelListEditorOpen = true;
            },
            
            // Close the model list editor
            closeModelListEditor() {
                this.isModelListEditorOpen = false;
                this.currentModelType = null;
            },
            
            // Get the current model list based on type
            getCurrentModelList() {
                switch (this.currentModelType) {
                    case 'chat':
                        return this.chat_models;
                    case 'util':
                        return this.util_models;
                    case 'embed':
                        return this.embed_models;
                    case 'browser':
                        return this.browser_models;
                    default:
                        return [];
                }
            },
            
            // Add a new model to the current list
            addModel() {
                const list = this.getCurrentModelList();
                list.push({
                    provider: "OPENAI",
                    name: "",
                    kwargs: { "temperature": "0" },
                    ctx_length: 0,
                    vision: false,
                    rl_requests: 0,
                    rl_input: 0,
                    rl_output: 0
                });
            },
            
            // Remove a model from the current list
            removeModel(index) {
                const list = this.getCurrentModelList();
                list.splice(index, 1);
            },
            
            // Move a model up in the list
            moveModelUp(index) {
                if (index <= 0) return;
                const list = this.getCurrentModelList();
                const temp = list[index];
                list[index] = list[index - 1];
                list[index - 1] = temp;
            },
            
            // Move a model down in the list
            moveModelDown(index) {
                const list = this.getCurrentModelList();
                if (index >= list.length - 1) return;
                const temp = list[index];
                list[index] = list[index + 1];
                list[index + 1] = temp;
            },
            
            // Save the current model list back to settings
            saveModelList() {
                // Update the appropriate model list in settings
                const modalEl = document.getElementById('settingsModal');
                const modalAD = Alpine.$data(modalEl);
                
                switch (this.currentModelType) {
                    case 'chat':
                        modalAD.settings.chat_models = this.chat_models;
                        break;
                    case 'util':
                        modalAD.settings.util_models = this.util_models;
                        break;
                    case 'embed':
                        modalAD.settings.embed_models = this.embed_models;
                        break;
                    case 'browser':
                        modalAD.settings.browser_models = this.browser_models;
                        break;
                }
                
                this.closeModelListEditor();
            }
        };
    });
});
