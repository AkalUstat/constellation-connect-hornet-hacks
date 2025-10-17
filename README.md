Using React Router framework (vite-create react app).

NodeJS: latest LTS 22.20.0
python 3.13

Using Venv for python (see instructions below)



## Venv
- Setup Virtual environment:
`python -m venv constellation`

- Activate virtual environment
Windows: ` constellation\Scripts\activate`

MacOS: `source constellation/bin/activate`




• Create a requirements.txt file: 
	• Once you have installed all necessary packages within your virtual environment, generate a requirements.txt file that lists all the project's dependencies and their exact versions. 
	• Activate your virtual environment and run: 

        pip freeze > requirements.txt

• Add requirements.txt to Git: 
	• Include the requirements.txt file in your Git repository and commit it. This ensures that all collaborators have access to the exact dependency list. 

• Add the virtual environment to .gitignore: 
	• Crucially, do not commit the virtual environment itself to Git. Add the virtual environment's directory (commonly named venv, .venv, or a custom name) to your project's .gitignore file. 

        # .gitignore
        venv/
        .venv/

• Collaborator workflow: 
	• When a collaborator clones the repository, they will receive the requirements.txt file. 
	• They should then create their own virtual environment: 

        python -m venv venv  # Or a different name

Activate their newly created virtual environment. 
        # On Linux/macOS
        source venv/bin/activate
        # On Windows
        venv\Scripts\activate

• Install the project's dependencies using the requirements.txt file: 

        pip install -r requirements.txt

This process ensures that everyone working on the project uses the same set of dependencies, while maintaining independent and easily reproducible virtual environments on their respective machines. 

AI responses may include mistakes.

