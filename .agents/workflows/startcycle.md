description: Autonomous app development pipeline

When user types:
/startcycle <idea>

### Execution Flow:

1. Act as @pm → run write_specs.md
2. WAIT for user approval
3. Act as @engineer → run generate_code.md
4. Act as @qa → run audit_code.md
5. Act as @devops → run deploy_app.md
