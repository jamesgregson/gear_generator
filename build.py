from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('templates'))
template = env.get_template('spur_gear_ui.html')
output_from_parsed_template = template.render()
print output_from_parsed_template

# to save the results
with open("gear_generator.html", "wb") as fh:
    fh.write(output_from_parsed_template)