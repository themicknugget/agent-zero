from python.helpers.tool import Tool, Response

class ResponseTool(Tool):

    async def execute(self,**kwargs):
        # Safely get the text with a fallback to empty string if not present
        message = self.args.get("text", "")
        return Response(message=message, break_loop=True)

    async def before_execution(self, **kwargs):
        self.log = self.agent.context.log.log(type="response", heading=f"{self.agent.agent_name}: Responding", content=self.args.get("text", ""))


    async def after_execution(self, response, **kwargs):
        pass # do not add anything to the history or output