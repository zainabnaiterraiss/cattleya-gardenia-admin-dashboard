# from flask import Flask, send_file
# import os
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/demandes', methods=['GET'])
# def get_demandes():
#     filepath = 'rapport_services_paysagers.csv'
#     if os.path.exists(filepath):
#         return send_file(filepath, mimetype='text/csv', as_attachment=True)
#     else:
#         return "Le fichier n'existe pas.", 404

# if __name__ == '__main__':
#     app.run(debug=True)
# api.py









# from flask import Flask, send_file
# from flask_cors import CORS
# import os

# # Importer le blueprint depuis routes.py
# from routes import notifier_bp

# app = Flask(__name__)
# CORS(app)

# # Enregistrer le blueprint
# app.register_blueprint(notifier_bp)

# @app.route('/demandes', methods=['GET'])
# def get_demandes():
#     filepath = 'rapport_services_paysagers.csv'
#     if os.path.exists(filepath):
#         return send_file(filepath, mimetype='text/csv', as_attachment=True)
#     else:
#         return "Le fichier n'existe pas.", 404

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, send_file
from flask_cors import CORS
import os
import subprocess
from flask import jsonify
import subprocess
import traceback

# 🔗 Importer les blueprints
from routes import notifier_bp
from analyse_reviews import analyse_reviews_bp
from satisfaction_over_time import satisfaction_bp 

app = Flask(__name__)
CORS(app)


# 🧩 Enregistrement des blueprints
app.register_blueprint(notifier_bp)
app.register_blueprint(analyse_reviews_bp)
app.register_blueprint(satisfaction_bp)












@app.route('/relancer-traitement', methods=['POST'])
def relancer_traitement():
    try:
        result = subprocess.run(
            ["python", "generer_rapport.py"],
            capture_output=True,
            text=True,
            check=True
        )
        print(" Script exécuté avec succès.")
        print("STDOUT :", result.stdout)
        print("STDERR :", result.stderr)
        return jsonify({"message": "Rapport mis à jour avec succès."}), 200

    except subprocess.CalledProcessError as e:
        print(" Erreur lors de l'exécution de generer_rapport.py")
        print("Code de sortie :", e.returncode)
        print("STDOUT :", e.stdout)
        print("STDERR :", e.stderr)
        return jsonify({"message": "Erreur lors de l’exécution du rapport."}), 500























@app.route('/demandes', methods=['GET'])
def get_demandes():
    filepath = 'rapport_services_paysagers.csv'
    if os.path.exists(filepath):
        return send_file(filepath, mimetype='text/csv', as_attachment=True)
    else:
        return "Le fichier n'existe pas.", 404
        

if __name__ == '__main__':
    app.run(debug=True)
