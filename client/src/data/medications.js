// Comprehensive veterinary medications database for autocomplete
export const commonMedications = {
  // Dog medications
  dog: [
    // Pain/Anti-inflammatory (NSAIDs)
    { name: 'Carprofen', brandName: 'Rimadyl', category: 'Anti-inflammatory', commonDoses: ['25mg', '75mg', '100mg'] },
    { name: 'Meloxicam', brandName: 'Metacam', category: 'Anti-inflammatory', commonDoses: ['7.5mg', '15mg'] },
    { name: 'Deracoxib', brandName: 'Deramaxx', category: 'Anti-inflammatory', commonDoses: ['12mg', '25mg', '75mg'] },
    { name: 'Firocoxib', brandName: 'Previcox', category: 'Anti-inflammatory', commonDoses: ['57mg', '227mg'] },
    { name: 'Grapiprant', brandName: 'Galliprant', category: 'Anti-inflammatory', commonDoses: ['20mg', '60mg', '100mg'] },
    { name: 'Tepoxalin', brandName: 'Zubrin', category: 'Anti-inflammatory', commonDoses: ['30mg', '50mg', '100mg'] },
    { name: 'Robenacoxib', brandName: 'Onsior', category: 'Anti-inflammatory', commonDoses: ['5mg', '10mg', '20mg', '40mg'] },
    { name: 'Etodolac', brandName: 'EtoGesic', category: 'Anti-inflammatory', commonDoses: ['150mg', '300mg'] },

    // Pain Management (Opioids & Others)
    { name: 'Tramadol', brandName: 'Tramadol', category: 'Pain', commonDoses: ['50mg'] },
    { name: 'Gabapentin', brandName: 'Neurontin', category: 'Pain/Anxiety', commonDoses: ['100mg', '300mg', '400mg'] },
    { name: 'Buprenorphine', brandName: 'Buprenex', category: 'Pain', commonDoses: ['0.3mg/ml'] },
    { name: 'Butorphanol', brandName: 'Torbugesic', category: 'Pain', commonDoses: ['1mg', '5mg', '10mg'] },
    { name: 'Morphine', brandName: 'Morphine', category: 'Pain', commonDoses: ['15mg', '30mg'] },
    { name: 'Fentanyl', brandName: 'Duragesic', category: 'Pain', commonDoses: ['25mcg', '50mcg', '75mg'] },
    { name: 'Codeine', brandName: 'Codeine', category: 'Pain', commonDoses: ['15mg', '30mg'] },

    // Antibiotics - Penicillins
    { name: 'Amoxicillin', brandName: 'Amoxil', category: 'Antibiotic', commonDoses: ['100mg', '250mg', '500mg'] },
    { name: 'Amoxicillin-Clavulanate', brandName: 'Clavamox', category: 'Antibiotic', commonDoses: ['62.5mg', '125mg', '250mg', '375mg'] },
    { name: 'Ampicillin', brandName: 'Principen', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Penicillin G', brandName: 'Penicillin G', category: 'Antibiotic', commonDoses: ['300,000 units', '600,000 units'] },
    { name: 'Penicillin V', brandName: 'Pen Vee K', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },

    // Antibiotics - Cephalosporins
    { name: 'Cephalexin', brandName: 'Keflex', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Cefpodoxime', brandName: 'Simplicef', category: 'Antibiotic', commonDoses: ['100mg', '200mg'] },
    { name: 'Cefovecin', brandName: 'Convenia', category: 'Antibiotic', commonDoses: ['Injection'] },

    // Antibiotics - Fluoroquinolones
    { name: 'Enrofloxacin', brandName: 'Baytril', category: 'Antibiotic', commonDoses: ['22.7mg', '68mg', '136mg'] },
    { name: 'Marbofloxacin', brandName: 'Zeniquin', category: 'Antibiotic', commonDoses: ['25mg', '50mg', '100mg', '200mg'] },
    { name: 'Orbifloxacin', brandName: 'Orbax', category: 'Antibiotic', commonDoses: ['5.7mg', '22.7mg'] },
    { name: 'Ciprofloxacin', brandName: 'Cipro', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },

    // Antibiotics - Macrolides
    { name: 'Azithromycin', brandName: 'Zithromax', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Erythromycin', brandName: 'Ery-Tab', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Clarithromycin', brandName: 'Biaxin', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Tulathromycin', brandName: 'Draxxin', category: 'Antibiotic', commonDoses: ['Injection'] },

    // Antibiotics - Tetracyclines
    { name: 'Doxycycline', brandName: 'Vibramycin', category: 'Antibiotic', commonDoses: ['50mg', '100mg'] },
    { name: 'Minocycline', brandName: 'Minocin', category: 'Antibiotic', commonDoses: ['50mg', '100mg'] },
    { name: 'Tetracycline', brandName: 'Tetracycline', commonDoses: ['250mg', '500mg'] },

    // Antibiotics - Others
    { name: 'Clindamycin', brandName: 'Antirobe', category: 'Antibiotic', commonDoses: ['25mg', '75mg', '150mg'] },
    { name: 'Metronidazole', brandName: 'Flagyl', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Chloramphenicol', brandName: 'Chloromycetin', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Trimethoprim-Sulfamethoxazole', brandName: 'Bactrim', category: 'Antibiotic', commonDoses: ['80mg-400mg', '160mg-800mg'] },
    { name: 'Rifampin', brandName: 'Rifadin', category: 'Antibiotic', commonDoses: ['150mg', '300mg'] },

    // Heart medications - ACE Inhibitors
    { name: 'Enalapril', brandName: 'Enacard', category: 'Heart', commonDoses: ['2.5mg', '5mg', '10mg', '20mg'] },
    { name: 'Benazepril', brandName: 'Fortekor', category: 'Heart', commonDoses: ['5mg', '20mg'] },
    { name: 'Lisinopril', brandName: 'Prinivil', category: 'Heart', commonDoses: ['2.5mg', '5mg', '10mg'] },

    // Heart medications - Inotropes
    { name: 'Pimobendan', brandName: 'Vetmedin', category: 'Heart', commonDoses: ['1.25mg', '2.5mg', '5mg', '10mg'] },
    { name: 'Digoxin', brandName: 'Lanoxin', category: 'Heart', commonDoses: ['0.125mg', '0.25mg'] },

    // Heart medications - Diuretics
    { name: 'Furosemide', brandName: 'Lasix', category: 'Heart/Diuretic', commonDoses: ['12.5mg', '25mg', '50mg'] },
    { name: 'Spironolactone', brandName: 'Aldactone', category: 'Heart/Diuretic', commonDoses: ['25mg', '50mg'] },
    { name: 'Hydrochlorothiazide', brandName: 'HCTZ', category: 'Diuretic', commonDoses: ['25mg', '50mg'] },

    // Heart medications - Others
    { name: 'Diltiazem', brandName: 'Cardizem', category: 'Heart', commonDoses: ['30mg', '60mg', '90mg'] },
    { name: 'Amlodipine', brandName: 'Norvasc', category: 'Heart', commonDoses: ['2.5mg', '5mg'] },
    { name: 'Atenolol', brandName: 'Tenormin', category: 'Heart', commonDoses: ['25mg', '50mg', '100mg'] },
    { name: 'Propranolol', brandName: 'Inderal', category: 'Heart', commonDoses: ['10mg', '40mg', '80mg'] },

    // Seizure medications
    { name: 'Phenobarbital', brandName: 'Phenobarbital', category: 'Seizure', commonDoses: ['15mg', '30mg', '60mg', '100mg'] },
    { name: 'Potassium Bromide', brandName: 'K-Brovet', category: 'Seizure', commonDoses: ['250mg', '500mg'] },
    { name: 'Levetiracetam', brandName: 'Keppra', category: 'Seizure', commonDoses: ['250mg', '500mg', '750mg'] },
    { name: 'Zonisamide', brandName: 'Zonegran', category: 'Seizure', commonDoses: ['25mg', '50mg', '100mg'] },
    { name: 'Gabapentin', brandName: 'Neurontin', category: 'Seizure', commonDoses: ['100mg', '300mg'] },
    { name: 'Pregabalin', brandName: 'Lyrica', category: 'Seizure', commonDoses: ['25mg', '50mg', '75mg'] },

    // Steroids & Anti-inflammatory
    { name: 'Prednisone', brandName: 'Prednisone', category: 'Steroid', commonDoses: ['5mg', '10mg', '20mg'] },
    { name: 'Prednisolone', brandName: 'Prednisolone', category: 'Steroid', commonDoses: ['5mg', '10mg', '25mg'] },
    { name: 'Methylprednisolone', brandName: 'Medrol', category: 'Steroid', commonDoses: ['4mg', '8mg', '16mg'] },
    { name: 'Dexamethasone', brandName: 'Decadron', category: 'Steroid', commonDoses: ['0.25mg', '0.5mg', '0.75mg'] },
    { name: 'Triamcinolone', brandName: 'Kenalog', category: 'Steroid', commonDoses: ['4mg', '8mg'] },
    { name: 'Hydrocortisone', brandName: 'Cortisone', category: 'Steroid', commonDoses: ['10mg', '20mg'] },

    // Allergy/Antihistamines
    { name: 'Apoquel', brandName: 'Apoquel', category: 'Allergy', commonDoses: ['3.6mg', '5.4mg', '16mg'] },
    { name: 'Cytopoint', brandName: 'Cytopoint', category: 'Allergy', commonDoses: ['Injection'] },
    { name: 'Diphenhydramine', brandName: 'Benadryl', category: 'Antihistamine', commonDoses: ['25mg', '50mg'] },
    { name: 'Chlorpheniramine', brandName: 'Chlor-Trimeton', category: 'Antihistamine', commonDoses: ['4mg', '8mg'] },
    { name: 'Hydroxyzine', brandName: 'Atarax', category: 'Antihistamine', commonDoses: ['10mg', '25mg', '50mg'] },
    { name: 'Cetirizine', brandName: 'Zyrtec', category: 'Antihistamine', commonDoses: ['5mg', '10mg'] },
    { name: 'Loratadine', brandName: 'Claritin', category: 'Antihistamine', commonDoses: ['5mg', '10mg'] },

    // Thyroid medications
    { name: 'Levothyroxine', brandName: 'Soloxine', category: 'Thyroid', commonDoses: ['0.1mg', '0.2mg', '0.3mg', '0.4mg', '0.5mg', '0.6mg', '0.7mg', '0.8mg'] },
    { name: 'Liothyronine', brandName: 'Cytomel', category: 'Thyroid', commonDoses: ['5mcg', '25mcg'] },

    // Flea/Tick prevention
    { name: 'NexGard', brandName: 'NexGard', category: 'Parasite Prevention', commonDoses: ['11.3mg', '28.3mg', '68mg', '136mg'] },
    { name: 'Bravecto', brandName: 'Bravecto', category: 'Parasite Prevention', commonDoses: ['112.5mg', '250mg', '500mg', '1000mg', '1400mg'] },
    { name: 'Simparica', brandName: 'Simparica', category: 'Parasite Prevention', commonDoses: ['5mg', '10mg', '20mg', '40mg', '80mg', '120mg'] },
    { name: 'Seresto Collar', brandName: 'Seresto', category: 'Parasite Prevention', commonDoses: ['Collar'] },
    { name: 'Credelio', brandName: 'Credelio', category: 'Parasite Prevention', commonDoses: ['12mg', '25mg', '50mg', '100mg'] },
    { name: 'Frontline Plus', brandName: 'Frontline Plus', category: 'Flea Prevention', commonDoses: ['Topical'] },
    { name: 'Advantix', brandName: 'K9 Advantix', category: 'Flea Prevention', commonDoses: ['Topical'] },

    // Heartworm prevention
    { name: 'Heartgard Plus', brandName: 'Heartgard Plus', category: 'Heartworm Prevention', commonDoses: ['68mcg', '136mcg', '272mcg'] },
    { name: 'Sentinel', brandName: 'Sentinel', category: 'Heartworm Prevention', commonDoses: ['2.3mg', '5.75mg', '11.5mg', '23mg'] },
    { name: 'Revolution', brandName: 'Revolution', category: 'Heartworm Prevention', commonDoses: ['15mg', '45mg', '120mg', '240mg'] },
    { name: 'Trifexis', brandName: 'Trifexis', category: 'Heartworm Prevention', commonDoses: ['140mg', '270mg', '560mg', '810mg', '1620mg'] },
    { name: 'Interceptor', brandName: 'Interceptor', category: 'Heartworm Prevention', commonDoses: ['2.3mg', '5.75mg', '11.5mg', '23mg'] },

    // Gastrointestinal
    { name: 'Omeprazole', brandName: 'Prilosec', category: 'Gastrointestinal', commonDoses: ['10mg', '20mg'] },
    { name: 'Famotidine', brandName: 'Pepcid', category: 'Gastrointestinal', commonDoses: ['10mg', '20mg'] },
    { name: 'Ranitidine', brandName: 'Zantac', category: 'Gastrointestinal', commonDoses: ['75mg', '150mg'] },
    { name: 'Sucralfate', brandName: 'Carafate', category: 'Gastrointestinal', commonDoses: ['1g'] },
    { name: 'Cerenia', brandName: 'Cerenia', category: 'Anti-nausea', commonDoses: ['16mg', '24mg', '60mg', '160mg'] },
    { name: 'Ondansetron', brandName: 'Zofran', category: 'Anti-nausea', commonDoses: ['4mg', '8mg'] },
    { name: 'Metoclopramide', brandName: 'Reglan', category: 'Gastrointestinal', commonDoses: ['5mg', '10mg'] },
    { name: 'Loperamide', brandName: 'Imodium', category: 'Anti-diarrheal', commonDoses: ['2mg'] },
    { name: 'Kaolin-Pectin', brandName: 'Kaopectate', category: 'Anti-diarrheal', commonDoses: ['Liquid'] },

    // Behavioral/Anxiety
    { name: 'Fluoxetine', brandName: 'Prozac', category: 'Behavioral', commonDoses: ['10mg', '20mg', '40mg'] },
    { name: 'Sertraline', brandName: 'Zoloft', category: 'Behavioral', commonDoses: ['25mg', '50mg', '100mg'] },
    { name: 'Paroxetine', brandName: 'Paxil', category: 'Behavioral', commonDoses: ['10mg', '20mg'] },
    { name: 'Clomipramine', brandName: 'Clomicalm', category: 'Behavioral', commonDoses: ['5mg', '20mg', '80mg'] },
    { name: 'Trazodone', brandName: 'Trazodone', category: 'Anxiety', commonDoses: ['50mg', '100mg'] },
    { name: 'Alprazolam', brandName: 'Xanax', category: 'Anxiety', commonDoses: ['0.25mg', '0.5mg'] },
    { name: 'Sileo', brandName: 'Sileo', category: 'Anxiety', commonDoses: ['Gel'] },

    // Eye medications
    { name: 'Cyclosporine', brandName: 'Optimmune', category: 'Eye', commonDoses: ['0.2%'] },
    { name: 'Tacrolimus', brandName: 'Protopic', category: 'Eye', commonDoses: ['0.02%'] },
    { name: 'Atropine', brandName: 'Atropine', category: 'Eye', commonDoses: ['1%'] },
    { name: 'Prednisolone Acetate', brandName: 'Pred Forte', category: 'Eye', commonDoses: ['1%'] },
    { name: 'Tobramycin', brandName: 'Tobrex', category: 'Eye', commonDoses: ['0.3%'] },

    // Ear medications
    { name: 'Tresaderm', brandName: 'Tresaderm', category: 'Ear', commonDoses: ['Drops'] },
    { name: 'Otomax', brandName: 'Otomax', category: 'Ear', commonDoses: ['Ointment'] },
    { name: 'Surolan', brandName: 'Surolan', category: 'Ear', commonDoses: ['Drops'] },

    // Diabetes
    { name: 'Insulin NPH', brandName: 'Humulin N', category: 'Diabetes', commonDoses: ['U-100'] },
    { name: 'Insulin Glargine', brandName: 'Lantus', category: 'Diabetes', commonDoses: ['U-100'] },
    { name: 'ProZinc', brandName: 'ProZinc', category: 'Diabetes', commonDoses: ['U-40'] },

    // Supplements
    { name: 'Glucosamine', brandName: 'Cosequin', category: 'Supplement', commonDoses: ['Various'] },
    { name: 'Omega-3 Fatty Acids', brandName: 'Fish Oil', category: 'Supplement', commonDoses: ['Various'] },
    { name: 'Probiotics', brandName: 'FortiFlora', category: 'Supplement', commonDoses: ['1g packets'] },
    { name: 'Milk Thistle', brandName: 'Milk Thistle', category: 'Supplement', commonDoses: ['Various'] },
    { name: 'SAMe', brandName: 'Denosyl', category: 'Supplement', commonDoses: ['90mg', '225mg', '425mg'] },

    // Additional Comprehensive Dog Medications

    // Chemotherapy & Cancer Medications
    { name: 'Palladia', brandName: 'Palladia', category: 'Chemotherapy', commonDoses: ['10mg', '15mg', '50mg'] },
    { name: 'Elspar', brandName: 'Elspar', category: 'Chemotherapy', commonDoses: ['Injection'] },
    { name: 'Carboplatin', brandName: 'Paraplatin', category: 'Chemotherapy', commonDoses: ['Injection'] },
    { name: 'Doxorubicin', brandName: 'Adriamycin', category: 'Chemotherapy', commonDoses: ['Injection'] },
    { name: 'Vincristine', brandName: 'Oncovin', category: 'Chemotherapy', commonDoses: ['Injection'] },
    { name: 'Cyclophosphamide', brandName: 'Cytoxan', category: 'Chemotherapy', commonDoses: ['25mg', '50mg'] },
    { name: 'Chlorambucil', brandName: 'Leukeran', category: 'Chemotherapy', commonDoses: ['2mg'] },
    { name: 'Lomustine', brandName: 'CeeNU', category: 'Chemotherapy', commonDoses: ['10mg', '40mg', '100mg'] },

    // Emergency/Critical Care Medications
    { name: 'Epinephrine', brandName: 'EpiPen', category: 'Emergency', commonDoses: ['1:1000', '1:10000'] },
    { name: 'Dextrose', brandName: 'D50W', category: 'Emergency', commonDoses: ['50%'] },
    { name: 'Sodium Bicarbonate', brandName: 'Sodium Bicarb', category: 'Emergency', commonDoses: ['8.4%'] },
    { name: 'Calcium Gluconate', brandName: 'Calcium Gluconate', category: 'Emergency', commonDoses: ['10%'] },
    { name: 'Naloxone', brandName: 'Narcan', category: 'Emergency', commonDoses: ['0.4mg/ml'] },
    { name: 'Flumazenil', brandName: 'Romazicon', category: 'Emergency', commonDoses: ['0.1mg/ml'] },
    { name: 'Atipamezole', brandName: 'Antisedan', category: 'Emergency', commonDoses: ['5mg/ml'] },
    { name: 'Yohimbine', brandName: 'Yobine', category: 'Emergency', commonDoses: ['2mg/ml'] },

    // Anesthetics & Sedatives
    { name: 'Propofol', brandName: 'Propofol', category: 'Anesthetic', commonDoses: ['10mg/ml'] },
    { name: 'Isoflurane', brandName: 'Isoflurane', category: 'Anesthetic', commonDoses: ['Inhalant'] },
    { name: 'Sevoflurane', brandName: 'Sevoflurane', category: 'Anesthetic', commonDoses: ['Inhalant'] },
    { name: 'Acepromazine', brandName: 'PromAce', category: 'Sedative', commonDoses: ['5mg', '10mg', '25mg'] },
    { name: 'Dexmedetomidine', brandName: 'Dexdomitor', category: 'Sedative', commonDoses: ['0.5mg/ml'] },
    { name: 'Midazolam', brandName: 'Versed', category: 'Sedative', commonDoses: ['1mg/ml', '5mg/ml'] },
    { name: 'Diazepam', brandName: 'Valium', category: 'Sedative', commonDoses: ['2mg', '5mg', '10mg'] },
    { name: 'Ketamine', brandName: 'Ketamine', category: 'Anesthetic', commonDoses: ['100mg/ml'] },
    { name: 'Tiletamine-Zolazepam', brandName: 'Telazol', category: 'Anesthetic', commonDoses: ['100mg/ml'] },

    // Muscle Relaxants
    { name: 'Methocarbamol', brandName: 'Robaxin', category: 'Muscle Relaxant', commonDoses: ['500mg', '750mg'] },
    { name: 'Baclofen', brandName: 'Lioresal', category: 'Muscle Relaxant', commonDoses: ['10mg', '20mg'] },
    { name: 'Dantrolene', brandName: 'Dantrium', category: 'Muscle Relaxant', commonDoses: ['25mg', '50mg', '100mg'] },

    // Respiratory Medications
    { name: 'Theophylline', brandName: 'Theo-Dur', category: 'Respiratory', commonDoses: ['100mg', '200mg', '300mg'] },
    { name: 'Albuterol', brandName: 'Ventolin', category: 'Respiratory', commonDoses: ['2mg', '4mg'] },
    { name: 'Terbutaline', brandName: 'Brethine', category: 'Respiratory', commonDoses: ['2.5mg', '5mg'] },
    { name: 'Aminophylline', brandName: 'Aminophylline', category: 'Respiratory', commonDoses: ['100mg', '200mg'] },
    { name: 'Guaifenesin', brandName: 'Mucinex', category: 'Respiratory', commonDoses: ['200mg', '400mg'] },

    // Antifungal Medications
    { name: 'Itraconazole', brandName: 'Sporanox', category: 'Antifungal', commonDoses: ['100mg'] },
    { name: 'Fluconazole', brandName: 'Diflucan', category: 'Antifungal', commonDoses: ['50mg', '100mg', '200mg'] },
    { name: 'Ketoconazole', brandName: 'Nizoral', category: 'Antifungal', commonDoses: ['200mg'] },
    { name: 'Terbinafine', brandName: 'Lamisil', category: 'Antifungal', commonDoses: ['250mg'] },
    { name: 'Griseofulvin', brandName: 'Grifulvin', category: 'Antifungal', commonDoses: ['125mg', '250mg'] },
    { name: 'Lime Sulfur', brandName: 'Lime Sulfur Dip', category: 'Antifungal', commonDoses: ['Topical'] },

    // Antiviral Medications
    { name: 'Famciclovir', brandName: 'Famvir', category: 'Antiviral', commonDoses: ['125mg', '250mg', '500mg'] },
    { name: 'Acyclovir', brandName: 'Zovirax', category: 'Antiviral', commonDoses: ['200mg', '400mg', '800mg'] },
    { name: 'Interferon', brandName: 'Intron A', category: 'Antiviral', commonDoses: ['Various'] },

    // Immune System Modulators
    { name: 'Azathioprine', brandName: 'Imuran', category: 'Immunosuppressant', commonDoses: ['25mg', '50mg'] },
    { name: 'Cyclosporine', brandName: 'Atopica', category: 'Immunosuppressant', commonDoses: ['10mg', '25mg', '50mg', '100mg'] },
    { name: 'Mycophenolate', brandName: 'CellCept', category: 'Immunosuppressant', commonDoses: ['250mg', '500mg'] },
    { name: 'Methotrexate', brandName: 'Rheumatrex', category: 'Immunosuppressant', commonDoses: ['2.5mg'] },
    { name: 'Leflunomide', brandName: 'Arava', category: 'Immunosuppressant', commonDoses: ['10mg', '20mg'] },

    // Hormones & Endocrine
    { name: 'Mitotane', brandName: 'Lysodren', category: 'Endocrine', commonDoses: ['500mg'] },
    { name: 'Trilostane', brandName: 'Vetoryl', category: 'Endocrine', commonDoses: ['10mg', '30mg', '60mg', '120mg'] },
    { name: 'Selegiline', brandName: 'Anipryl', category: 'Endocrine', commonDoses: ['2mg', '5mg', '10mg', '15mg', '30mg'] },
    { name: 'Melatonin', brandName: 'Melatonin', category: 'Hormone', commonDoses: ['1mg', '3mg', '5mg'] },
    { name: 'Desoxycorticosterone', brandName: 'Percorten-V', category: 'Hormone', commonDoses: ['25mg/ml injection'] },

    // Urinary & Kidney Medications
    { name: 'Prazosin', brandName: 'Minipress', category: 'Urinary', commonDoses: ['1mg', '2mg', '5mg'] },
    { name: 'Phenoxybenzamine', brandName: 'Dibenzyline', category: 'Urinary', commonDoses: ['10mg'] },
    { name: 'Bethanechol', brandName: 'Urecholine', category: 'Urinary', commonDoses: ['5mg', '10mg', '25mg'] },
    { name: 'Oxybutynin', brandName: 'Ditropan', category: 'Urinary', commonDoses: ['5mg'] },
    { name: 'Amitriptyline', brandName: 'Elavil', category: 'Urinary', commonDoses: ['10mg', '25mg', '50mg'] },
    { name: 'Calcitriol', brandName: 'Rocaltrol', category: 'Kidney', commonDoses: ['0.25mcg', '0.5mcg'] },
    { name: 'Phosphorus Binders', brandName: 'Epakitin', category: 'Kidney', commonDoses: ['Various'] },

    // Specialized Eye/Ear Medications
    { name: 'Dorzolamide', brandName: 'Trusopt', category: 'Eye', commonDoses: ['2%'] },
    { name: 'Timolol', brandName: 'Timoptic', category: 'Eye', commonDoses: ['0.25%', '0.5%'] },
    { name: 'Latanoprost', brandName: 'Xalatan', category: 'Eye', commonDoses: ['0.005%'] },
    { name: 'Bimatoprost', brandName: 'Lumigan', category: 'Eye', commonDoses: ['0.03%'] },
    { name: 'Gentamicin', brandName: 'Gentak', category: 'Eye/Ear', commonDoses: ['0.3%'] },
    { name: 'Neomycin-Polymyxin-Hydrocortisone', brandName: 'Cortisporin', category: 'Ear', commonDoses: ['Otic solution'] },

    // Skin & Dermatology
    { name: 'Apoquel', brandName: 'Apoquel', category: 'Dermatology', commonDoses: ['3.6mg', '5.4mg', '16mg'] },
    { name: 'Cytopoint', brandName: 'Cytopoint', category: 'Dermatology', commonDoses: ['Injection'] },
    { name: 'Pentoxifylline', brandName: 'Trental', category: 'Dermatology', commonDoses: ['400mg'] },
    { name: 'Tetracycline-Niacinamide', brandName: 'Tetra-Niacin', category: 'Dermatology', commonDoses: ['Various'] },
    { name: 'Doxepin', brandName: 'Sinequan', category: 'Dermatology', commonDoses: ['10mg', '25mg', '50mg'] },

    // Neurological Medications
    { name: 'Felbamate', brandName: 'Felbatol', category: 'Seizure', commonDoses: ['400mg', '600mg'] },
    { name: 'Tiagabine', brandName: 'Gabitril', category: 'Seizure', commonDoses: ['2mg', '4mg', '12mg', '16mg'] },
    { name: 'Topiramate', brandName: 'Topamax', category: 'Seizure', commonDoses: ['25mg', '50mg', '100mg'] },
    { name: 'Lamotrigine', brandName: 'Lamictal', category: 'Seizure', commonDoses: ['25mg', '100mg', '150mg', '200mg'] },

    // Additional Specialized Medications
    { name: 'Ursodiol', brandName: 'Actigall', category: 'Hepatic', commonDoses: ['250mg', '300mg'] },
    { name: 'Lactulose', brandName: 'Cephulac', category: 'Hepatic', commonDoses: ['10g/15ml'] },
    { name: 'Zinc Acetate', brandName: 'Galzin', category: 'Hepatic', commonDoses: ['25mg', '50mg'] },
    { name: 'Pimobendan', brandName: 'Vetmedin', category: 'Cardiology', commonDoses: ['1.25mg', '2.5mg', '5mg', '10mg'] },
    { name: 'Sildenafil', brandName: 'Viagra', category: 'Cardiology', commonDoses: ['20mg', '25mg', '50mg'] },
    { name: 'Maropitant', brandName: 'Cerenia', category: 'Antiemetic', commonDoses: ['16mg', '24mg', '60mg', '160mg'] },

    // Weight Management
    { name: 'Dirlotapide', brandName: 'Slentrol', category: 'Weight Management', commonDoses: ['Various'] },

    // Reproductive Health
    { name: 'Cabergoline', brandName: 'Dostinex', category: 'Reproductive', commonDoses: ['0.5mg'] },
    { name: 'Aglepristone', brandName: 'Alizin', category: 'Reproductive', commonDoses: ['Injection'] },
    { name: 'Prostaglandin F2α', brandName: 'Lutalyse', category: 'Reproductive', commonDoses: ['Injection'] }
  ],
  
  // Cat medications
  cat: [
    // Pain/Anti-inflammatory (limited NSAIDs for cats)
    { name: 'Meloxicam', brandName: 'Metacam', category: 'Anti-inflammatory', commonDoses: ['0.5mg/ml suspension'] },
    { name: 'Robenacoxib', brandName: 'Onsior', category: 'Anti-inflammatory', commonDoses: ['6mg'] },
    { name: 'Buprenorphine', brandName: 'Simbadol', category: 'Pain', commonDoses: ['1.8mg/ml'] },
    { name: 'Gabapentin', brandName: 'Gabapentin', category: 'Pain/Anxiety', commonDoses: ['50mg', '100mg', '300mg'] },
    { name: 'Tramadol', brandName: 'Tramadol', category: 'Pain', commonDoses: ['50mg'] },
    { name: 'Butorphanol', brandName: 'Torbugesic', category: 'Pain', commonDoses: ['0.5mg', '1mg'] },

    // Antibiotics
    { name: 'Amoxicillin', brandName: 'Amoxil', category: 'Antibiotic', commonDoses: ['50mg', '100mg', '250mg'] },
    { name: 'Amoxicillin-Clavulanate', brandName: 'Clavamox', category: 'Antibiotic', commonDoses: ['62.5mg', '125mg', '250mg'] },
    { name: 'Azithromycin', brandName: 'Zithromax', category: 'Antibiotic', commonDoses: ['250mg'] },
    { name: 'Clindamycin', brandName: 'Antirobe', category: 'Antibiotic', commonDoses: ['25mg', '75mg'] },
    { name: 'Doxycycline', brandName: 'Vibramycin', category: 'Antibiotic', commonDoses: ['25mg', '50mg', '100mg'] },
    { name: 'Enrofloxacin', brandName: 'Baytril', category: 'Antibiotic', commonDoses: ['15mg', '50mg'] },
    { name: 'Marbofloxacin', brandName: 'Zeniquin', category: 'Antibiotic', commonDoses: ['25mg', '50mg'] },
    { name: 'Cephalexin', brandName: 'Keflex', category: 'Antibiotic', commonDoses: ['250mg', '500mg'] },
    { name: 'Metronidazole', brandName: 'Flagyl', category: 'Antibiotic', commonDoses: ['250mg'] },
    { name: 'Chloramphenicol', brandName: 'Chloromycetin', category: 'Antibiotic', commonDoses: ['250mg'] },

    // Heart medications
    { name: 'Enalapril', brandName: 'Enacard', category: 'Heart', commonDoses: ['1mg', '2.5mg', '5mg'] },
    { name: 'Benazepril', brandName: 'Fortekor', category: 'Heart', commonDoses: ['2.5mg', '5mg'] },
    { name: 'Diltiazem', brandName: 'Cardizem', category: 'Heart', commonDoses: ['30mg', '60mg'] },
    { name: 'Furosemide', brandName: 'Lasix', category: 'Heart/Diuretic', commonDoses: ['12.5mg', '25mg'] },
    { name: 'Spironolactone', brandName: 'Aldactone', category: 'Heart/Diuretic', commonDoses: ['25mg'] },
    { name: 'Atenolol', brandName: 'Tenormin', category: 'Heart', commonDoses: ['6.25mg', '12.5mg', '25mg'] },
    { name: 'Amlodipine', brandName: 'Norvasc', category: 'Heart', commonDoses: ['1.25mg', '2.5mg'] },

    // Thyroid medications
    { name: 'Methimazole', brandName: 'Tapazole', category: 'Hyperthyroid', commonDoses: ['2.5mg', '5mg'] },
    { name: 'Carbimazole', brandName: 'Carbimazole', category: 'Hyperthyroid', commonDoses: ['5mg'] },
    { name: 'Y/d Diet', brandName: 'Hill\'s y/d', category: 'Hyperthyroid', commonDoses: ['Prescription Diet'] },
    { name: 'Radioactive Iodine', brandName: 'I-131', category: 'Hyperthyroid', commonDoses: ['Treatment'] },

    // Steroids (use with caution in cats)
    { name: 'Prednisolone', brandName: 'Prednisolone', category: 'Steroid', commonDoses: ['5mg'] },
    { name: 'Methylprednisolone', brandName: 'Medrol', category: 'Steroid', commonDoses: ['2mg', '4mg'] },
    { name: 'Dexamethasone', brandName: 'Decadron', category: 'Steroid', commonDoses: ['0.25mg', '0.5mg'] },

    // Antihistamines
    { name: 'Chlorpheniramine', brandName: 'Chlor-Trimeton', category: 'Antihistamine', commonDoses: ['2mg', '4mg'] },
    { name: 'Diphenhydramine', brandName: 'Benadryl', category: 'Antihistamine', commonDoses: ['12.5mg', '25mg'] },
    { name: 'Hydroxyzine', brandName: 'Atarax', category: 'Antihistamine', commonDoses: ['10mg', '25mg'] },

    // Flea prevention
    { name: 'Revolution Plus', brandName: 'Revolution Plus', category: 'Parasite Prevention', commonDoses: ['2.5-5kg', '5-10kg'] },
    { name: 'Advantage II', brandName: 'Advantage II', category: 'Flea Prevention', commonDoses: ['0.4ml', '0.8ml'] },
    { name: 'Frontline Plus', brandName: 'Frontline Plus', category: 'Flea Prevention', commonDoses: ['0.5ml'] },
    { name: 'Bravecto Plus', brandName: 'Bravecto Plus', category: 'Parasite Prevention', commonDoses: ['112.5mg', '250mg'] },
    { name: 'Seresto Collar', brandName: 'Seresto', category: 'Parasite Prevention', commonDoses: ['Collar'] },

    // Gastrointestinal
    { name: 'Cerenia', brandName: 'Cerenia', category: 'Anti-nausea', commonDoses: ['16mg'] },
    { name: 'Ondansetron', brandName: 'Zofran', category: 'Anti-nausea', commonDoses: ['4mg'] },
    { name: 'Famotidine', brandName: 'Pepcid', category: 'Gastrointestinal', commonDoses: ['5mg', '10mg'] },
    { name: 'Omeprazole', brandName: 'Prilosec', category: 'Gastrointestinal', commonDoses: ['10mg'] },
    { name: 'Sucralfate', brandName: 'Carafate', category: 'Gastrointestinal', commonDoses: ['1g'] },
    { name: 'Lactulose', brandName: 'Lactulose', category: 'Laxative', commonDoses: ['10g/15ml'] },
    { name: 'Metoclopramide', brandName: 'Reglan', category: 'Gastrointestinal', commonDoses: ['2.5mg', '5mg'] },

    // Behavioral
    { name: 'Fluoxetine', brandName: 'Prozac', category: 'Behavioral', commonDoses: ['5mg', '10mg', '20mg'] },
    { name: 'Sertraline', brandName: 'Zoloft', category: 'Behavioral', commonDoses: ['25mg', '50mg'] },
    { name: 'Gabapentin', brandName: 'Gabapentin', category: 'Anxiety', commonDoses: ['50mg', '100mg'] },
    { name: 'Trazodone', brandName: 'Trazodone', category: 'Anxiety', commonDoses: ['25mg', '50mg'] },
    { name: 'Alprazolam', brandName: 'Xanax', category: 'Anxiety', commonDoses: ['0.125mg', '0.25mg'] },

    // Kidney/Urinary
    { name: 'Phosphorus Binders', brandName: 'Epakitin', category: 'Kidney', commonDoses: ['Various'] },
    { name: 'Calcitriol', brandName: 'Rocaltrol', category: 'Kidney', commonDoses: ['0.25mcg'] },
    { name: 'Prazosin', brandName: 'Minipress', category: 'Urinary', commonDoses: ['0.5mg', '1mg'] },

    // Eye medications
    { name: 'Cyclosporine', brandName: 'Optimmune', category: 'Eye', commonDoses: ['0.2%'] },
    { name: 'Tacrolimus', brandName: 'Protopic', category: 'Eye', commonDoses: ['0.02%'] },
    { name: 'Atropine', brandName: 'Atropine', category: 'Eye', commonDoses: ['1%'] },
    { name: 'Prednisolone Acetate', brandName: 'Pred Forte', category: 'Eye', commonDoses: ['1%'] },

    // Diabetes
    { name: 'Insulin Glargine', brandName: 'Lantus', category: 'Diabetes', commonDoses: ['U-100'] },
    { name: 'ProZinc', brandName: 'ProZinc', category: 'Diabetes', commonDoses: ['U-40'] },

    // Supplements
    { name: 'Coenzyme Q10', brandName: 'CoQ10', category: 'Supplement', commonDoses: ['30mg'] },
    { name: 'Omega-3 Fatty Acids', brandName: 'Fish Oil', category: 'Supplement', commonDoses: ['Various'] },
    { name: 'Probiotics', brandName: 'FortiFlora', category: 'Supplement', commonDoses: ['1g packets'] },
    { name: 'SAMe', brandName: 'Denosyl', category: 'Supplement', commonDoses: ['90mg'] },

    // Additional Comprehensive Cat Medications

    // Feline-Specific Respiratory
    { name: 'L-Lysine', brandName: 'L-Lysine', category: 'Respiratory', commonDoses: ['250mg', '500mg'] },
    { name: 'Viralys', brandName: 'Viralys', category: 'Respiratory', commonDoses: ['Gel', 'Powder'] },
    { name: 'Interferon Omega', brandName: 'Virbagen Omega', category: 'Antiviral', commonDoses: ['Injection'] },

    // Feline Immunodeficiency & Leukemia Support
    { name: 'Acemannan', brandName: 'CarraVet', category: 'Immune Support', commonDoses: ['Injection'] },
    { name: 'Human Interferon Alpha', brandName: 'Intron A', category: 'Antiviral', commonDoses: ['Oral drops'] },
    { name: 'Staphage Lysate', brandName: 'SPL', category: 'Immune Support', commonDoses: ['Injection'] },

    // Cancer/Chemotherapy for Cats
    { name: 'Chlorambucil', brandName: 'Leukeran', category: 'Chemotherapy', commonDoses: ['2mg'] },
    { name: 'Prednisolone', brandName: 'Prednisolone', category: 'Chemotherapy Support', commonDoses: ['2.5mg', '5mg'] },
    { name: 'Lomustine', brandName: 'CeeNU', category: 'Chemotherapy', commonDoses: ['10mg', '40mg'] },
    { name: 'Carboplatin', brandName: 'Paraplatin', category: 'Chemotherapy', commonDoses: ['Injection'] },
    { name: 'Doxorubicin', brandName: 'Adriamycin', category: 'Chemotherapy', commonDoses: ['Injection'] },

    // Feline Anesthetics & Pain (Cat-Safe)
    { name: 'Butorphanol', brandName: 'Torbugesic', category: 'Pain', commonDoses: ['0.5mg', '1mg', '5mg'] },
    { name: 'Buprenorphine', brandName: 'Simbadol', category: 'Pain', commonDoses: ['1.8mg/ml oral'] },
    { name: 'Ketamine', brandName: 'Ketamine', category: 'Anesthetic', commonDoses: ['100mg/ml'] },
    { name: 'Midazolam', brandName: 'Versed', category: 'Sedative', commonDoses: ['1mg/ml'] },
    { name: 'Acepromazine', brandName: 'PromAce', category: 'Sedative', commonDoses: ['5mg', '10mg'] },
    { name: 'Dexmedetomidine', brandName: 'Dexdomitor', category: 'Sedative', commonDoses: ['0.5mg/ml'] },

    // Feline Dermatology
    { name: 'Oclacitinib', brandName: 'Apoquel', category: 'Dermatology', commonDoses: ['3.6mg', '5.4mg'] },
    { name: 'Lokivetmab', brandName: 'Cytopoint', category: 'Dermatology', commonDoses: ['Injection'] },
    { name: 'Chlorpheniramine', brandName: 'Chlor-Trimeton', category: 'Antihistamine', commonDoses: ['2mg', '4mg'] },
    { name: 'Clemastine', brandName: 'Tavist', category: 'Antihistamine', commonDoses: ['1mg', '2mg'] },

    // Feline Infectious Disease
    { name: 'Pradofloxacin', brandName: 'Veraflox', category: 'Antibiotic', commonDoses: ['15mg', '60mg'] },
    { name: 'Cefovecin', brandName: 'Convenia', category: 'Antibiotic', commonDoses: ['Injection 14-day'] },
    { name: 'Tiamulin', brandName: 'Tiamutin', category: 'Antibiotic', commonDoses: ['Injection'] },

    // Feline Kidney Disease
    { name: 'Amlodipine', brandName: 'Norvasc', category: 'Hypertension', commonDoses: ['0.625mg', '1.25mg', '2.5mg'] },
    { name: 'Telmisartan', brandName: 'Semintra', category: 'Kidney', commonDoses: ['1mg/ml', '4mg/ml'] },
    { name: 'Calcitriol', brandName: 'Rocaltrol', category: 'Kidney', commonDoses: ['0.25mcg'] },
    { name: 'Aluminum Hydroxide', brandName: 'AlternaGEL', category: 'Phosphorus Binder', commonDoses: ['Various'] },
    { name: 'Erythropoietin', brandName: 'Epogen', category: 'Anemia', commonDoses: ['Injection'] },

    // Feline Liver Disease
    { name: 'Ursodeoxycholic Acid', brandName: 'Actigall', category: 'Hepatic', commonDoses: ['250mg'] },
    { name: 'SAMe', brandName: 'Denosyl', category: 'Hepatic', commonDoses: ['90mg'] },
    { name: 'Lactulose', brandName: 'Cephulac', category: 'Hepatic Encephalopathy', commonDoses: ['10g/15ml'] },

    // Feline Neurological
    { name: 'Phenobarbital', brandName: 'Phenobarbital', category: 'Seizure', commonDoses: ['15mg', '30mg'] },
    { name: 'Potassium Bromide', brandName: 'K-Brovet', category: 'Seizure', commonDoses: ['250mg'] },
    { name: 'Levetiracetam', brandName: 'Keppra', category: 'Seizure', commonDoses: ['250mg', '500mg'] },
    { name: 'Zonisamide', brandName: 'Zonegran', category: 'Seizure', commonDoses: ['25mg', '50mg'] },

    // Feline Respiratory Support
    { name: 'Theophylline', brandName: 'Theo-Dur', category: 'Respiratory', commonDoses: ['100mg'] },
    { name: 'Terbutaline', brandName: 'Brethine', category: 'Respiratory', commonDoses: ['1.25mg', '2.5mg'] },
    { name: 'Albuterol', brandName: 'Ventolin', category: 'Respiratory', commonDoses: ['Inhaler'] },

    // Feline Emergency/Critical Care
    { name: 'Dextrose', brandName: 'D50W', category: 'Emergency', commonDoses: ['50%'] },
    { name: 'Calcium Gluconate', brandName: 'Calcium Gluconate', category: 'Emergency', commonDoses: ['10%'] },
    { name: 'Sodium Bicarbonate', brandName: 'Sodium Bicarb', category: 'Emergency', commonDoses: ['8.4%'] },
    { name: 'Epinephrine', brandName: 'EpiPen', category: 'Emergency', commonDoses: ['1:1000'] },
    { name: 'Atipamezole', brandName: 'Antisedan', category: 'Reversal Agent', commonDoses: ['5mg/ml'] },
    { name: 'Naloxone', brandName: 'Narcan', category: 'Reversal Agent', commonDoses: ['0.4mg/ml'] },

    // Feline Specialty Eye Care
    { name: 'Tacrolimus', brandName: 'Protopic', category: 'Eye', commonDoses: ['0.02%'] },
    { name: 'Cyclosporine', brandName: 'Optimmune', category: 'Eye', commonDoses: ['0.2%'] },
    { name: 'Dorzolamide', brandName: 'Trusopt', category: 'Glaucoma', commonDoses: ['2%'] },
    { name: 'Latanoprost', brandName: 'Xalatan', category: 'Glaucoma', commonDoses: ['0.005%'] },
    { name: 'Atropine', brandName: 'Atropine', category: 'Eye', commonDoses: ['1%'] },

    // Feline Exotic/Specialty
    { name: 'Megestrol Acetate', brandName: 'Ovaban', category: 'Reproductive', commonDoses: ['2.5mg', '5mg'] },
    { name: 'GnRH', brandName: 'Factrel', category: 'Reproductive', commonDoses: ['Injection'] },
    { name: 'Cabergoline', brandName: 'Dostinex', category: 'Reproductive', commonDoses: ['0.5mg'] },

    // Feline Muscle/Joint Support
    { name: 'Glucosamine-Chondroitin', brandName: 'Cosequin', category: 'Joint', commonDoses: ['Various'] },
    { name: 'Polysulfated Glycosaminoglycan', brandName: 'Adequan', category: 'Joint', commonDoses: ['Injection'] },
    { name: 'Hyaluronic Acid', brandName: 'Legend', category: 'Joint', commonDoses: ['Injection'] },

    // Feline Weight Management
    { name: 'Mirtazapine', brandName: 'Mirataz', category: 'Appetite Stimulant', commonDoses: ['2mg transdermal'] },
    { name: 'Capromorelin', brandName: 'Elura', category: 'Appetite Stimulant', commonDoses: ['2mg/ml oral gel'] },
    { name: 'Cyproheptadine', brandName: 'Periactin', category: 'Appetite Stimulant', commonDoses: ['2mg', '4mg'] },

    // Feline Antifungal (Expanded)
    { name: 'Itraconazole', brandName: 'Sporanox', category: 'Antifungal', commonDoses: ['100mg'] },
    { name: 'Fluconazole', brandName: 'Diflucan', category: 'Antifungal', commonDoses: ['50mg', '100mg'] },
    { name: 'Ketoconazole', brandName: 'Nizoral', category: 'Antifungal', commonDoses: ['200mg'] },
    { name: 'Terbinafine', brandName: 'Lamisil', category: 'Antifungal', commonDoses: ['250mg'] },

    // Feline Behavior Modification
    { name: 'Fluoxetine', brandName: 'Reconcile', category: 'Behavioral', commonDoses: ['5mg', '10mg', '20mg'] },
    { name: 'Sertraline', brandName: 'Zoloft', category: 'Behavioral', commonDoses: ['25mg', '50mg'] },
    { name: 'Paroxetine', brandName: 'Paxil', category: 'Behavioral', commonDoses: ['5mg', '10mg'] },
    { name: 'Clomipramine', brandName: 'Clomicalm', category: 'Behavioral', commonDoses: ['5mg', '20mg'] },
    { name: 'Buspirone', brandName: 'BuSpar', category: 'Anxiety', commonDoses: ['5mg', '10mg'] },
    { name: 'Alprazolam', brandName: 'Xanax', category: 'Anxiety', commonDoses: ['0.125mg', '0.25mg'] }
  ],
  
  // Common for both dogs and cats
  all: [
    { name: 'Saline Solution', brandName: 'Normal Saline', category: 'Fluid', commonDoses: ['0.9%'] },
    { name: 'Lactated Ringers', brandName: 'LRS', category: 'Fluid', commonDoses: ['IV fluid'] },
    { name: 'Vitamin B12', brandName: 'Cobalamin', category: 'Vitamin', commonDoses: ['1000mcg'] },
    { name: 'Vitamin E', brandName: 'Vitamin E', category: 'Vitamin', commonDoses: ['400 IU'] },
    { name: 'Activated Charcoal', brandName: 'Activated Charcoal', category: 'Toxin Binder', commonDoses: ['Various'] },
    
    // Additional Common Veterinary Medications
    { name: 'Glycopyrrolate', brandName: 'Robinul', category: 'Anesthetic Adjunct', commonDoses: ['0.2mg/ml'] },
    { name: 'Mannitol', brandName: 'Osmitrol', category: 'Diuretic', commonDoses: ['20%'] },
    { name: 'Hetastarch', brandName: 'Hespan', category: 'Colloid', commonDoses: ['6%'] },
    { name: 'Plasma-Lyte', brandName: 'Plasma-Lyte', category: 'Fluid', commonDoses: ['IV fluid'] },
    { name: 'Dopamine', brandName: 'Dopamine', category: 'Cardiac Support', commonDoses: ['40mg/ml'] },
    { name: 'Dobutamine', brandName: 'Dobutamine', category: 'Cardiac Support', commonDoses: ['12.5mg/ml'] },
    { name: 'Norepinephrine', brandName: 'Levophed', category: 'Vasopressor', commonDoses: ['1mg/ml'] },
    { name: 'Vasopressin', brandName: 'Pitressin', category: 'Vasopressor', commonDoses: ['20 units/ml'] },
    
    // Exotic Animal Medications
    { name: 'Meloxicam', brandName: 'Metacam', category: 'NSAID (Birds/Reptiles)', commonDoses: ['0.5mg/ml', '1.5mg/ml'] },
    { name: 'Carprofen', brandName: 'Rimadyl', category: 'NSAID (Birds)', commonDoses: ['Various'] },
    { name: 'Ivermectin', brandName: 'Ivomec', category: 'Antiparasitic', commonDoses: ['1%'] },
    { name: 'Fenbendazole', brandName: 'Panacur', category: 'Dewormer', commonDoses: ['22.2%'] },
    { name: 'Praziquantel', brandName: 'Droncit', category: 'Dewormer', commonDoses: ['Various'] },
    { name: 'Pyrantel Pamoate', brandName: 'Nemex', category: 'Dewormer', commonDoses: ['Various'] },
    
    // Additional Antibiotics
    { name: 'Tylosin', brandName: 'Tylan', category: 'Antibiotic', commonDoses: ['200mg/ml'] },
    { name: 'Florfenicol', brandName: 'Nuflor', category: 'Antibiotic', commonDoses: ['300mg/ml'] },
    { name: 'Ceftiofur', brandName: 'Excenel', category: 'Antibiotic', commonDoses: ['50mg/ml'] },
    { name: 'Sulfadimethoxine', brandName: 'Albon', category: 'Antibiotic', commonDoses: ['125mg/ml'] },
    { name: 'Oxytetracycline', brandName: 'Terramycin', category: 'Antibiotic', commonDoses: ['200mg/ml'] },
    
    // Vitamins & Supplements
    { name: 'Vitamin A', brandName: 'Vitamin A', category: 'Vitamin', commonDoses: ['Various'] },
    { name: 'Vitamin D3', brandName: 'Cholecalciferol', category: 'Vitamin', commonDoses: ['Various'] },
    { name: 'Vitamin K1', brandName: 'Phytonadione', category: 'Vitamin', commonDoses: ['10mg/ml'] },
    { name: 'Thiamine', brandName: 'Vitamin B1', category: 'Vitamin', commonDoses: ['100mg/ml'] },
    { name: 'Folic Acid', brandName: 'Folate', category: 'Vitamin', commonDoses: ['5mg'] },
    { name: 'Iron Dextran', brandName: 'Iron Dextran', category: 'Supplement', commonDoses: ['100mg/ml'] },
    
    // Topical/External Use
    { name: 'Betadine', brandName: 'Povidone Iodine', category: 'Antiseptic', commonDoses: ['10%'] },
    { name: 'Chlorhexidine', brandName: 'Nolvasan', category: 'Antiseptic', commonDoses: ['2%', '4%'] },
    { name: 'Silver Sulfadiazine', brandName: 'Silvadene', category: 'Topical Antibiotic', commonDoses: ['1%'] },
    { name: 'Mupirocin', brandName: 'Bactoderm', category: 'Topical Antibiotic', commonDoses: ['2%'] },
    { name: 'DMSO', brandName: 'Dimethyl Sulfoxide', category: 'Anti-inflammatory', commonDoses: ['90%'] },
    
    // Human Medications Sometimes Used in Veterinary Medicine
    { name: 'Lorazepam', brandName: 'Ativan', category: 'Sedative', commonDoses: ['0.5mg', '1mg', '2mg'] },
    { name: 'Zolpidem', brandName: 'Ambien', category: 'Sedative', commonDoses: ['5mg', '10mg'] },
    { name: 'Melatonin', brandName: 'Melatonin', category: 'Sleep Aid', commonDoses: ['1mg', '3mg', '5mg', '10mg'] },
    { name: 'Diphenhydramine', brandName: 'Benadryl', category: 'Antihistamine', commonDoses: ['25mg', '50mg'] },
    { name: 'Loratadine', brandName: 'Claritin', category: 'Antihistamine', commonDoses: ['10mg'] },
    { name: 'Cetirizine', brandName: 'Zyrtec', category: 'Antihistamine', commonDoses: ['5mg', '10mg'] },
    { name: 'Fexofenadine', brandName: 'Allegra', category: 'Antihistamine', commonDoses: ['30mg', '60mg', '180mg'] },
    
    // Human Medications (TOXIC - for interaction checking)
    { name: 'Acetaminophen', brandName: 'Tylenol', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Ibuprofen', brandName: 'Advil', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Aspirin', brandName: 'Aspirin', category: 'Human Med (CAUTION)', commonDoses: ['CONSULT VET'] },
    { name: 'Naproxen', brandName: 'Aleve', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Celecoxib', brandName: 'Celebrex', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Diclofenac', brandName: 'Voltaren', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Indomethacin', brandName: 'Indocin', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    { name: 'Ketorolac', brandName: 'Toradol', category: 'Human Med (TOXIC)', commonDoses: ['DO NOT USE'] },
    
    // Additional Toxic Substances
    { name: 'Xylitol', brandName: 'Sugar Substitute', category: 'Toxic Substance', commonDoses: ['TOXIC'] },
    { name: 'Grapes', brandName: 'Grapes/Raisins', category: 'Toxic Food', commonDoses: ['TOXIC'] },
    { name: 'Chocolate', brandName: 'Chocolate', category: 'Toxic Food', commonDoses: ['TOXIC'] },
    { name: 'Macadamia Nuts', brandName: 'Macadamia Nuts', category: 'Toxic Food', commonDoses: ['TOXIC'] },
    { name: 'Onion', brandName: 'Onion/Garlic', category: 'Toxic Food', commonDoses: ['TOXIC'] },
    { name: 'Avocado', brandName: 'Avocado', category: 'Toxic Food', commonDoses: ['TOXIC TO BIRDS'] },
    
    // Emergency Antidotes
    { name: 'Apomorphine', brandName: 'Apomorphine', category: 'Emetic', commonDoses: ['0.04mg/kg'] },
    { name: 'Hydrogen Peroxide', brandName: 'H2O2', category: 'Emetic', commonDoses: ['3%'] },
    { name: 'Methylene Blue', brandName: 'Methylene Blue', category: 'Antidote', commonDoses: ['1%'] },
    { name: 'N-Acetylcysteine', brandName: 'Mucomyst', category: 'Antidote', commonDoses: ['20%'] },
    { name: 'Fomepizole', brandName: 'Antizol', category: 'Antidote', commonDoses: ['5%'] },
    { name: 'Pralidoxime', brandName: '2-PAM', category: 'Antidote', commonDoses: ['Various'] },
    
    // Specialized Injectable Medications
    { name: 'Pentobarbital', brandName: 'Euthasol', category: 'Euthanasia', commonDoses: ['390mg/ml'] },
    { name: 'Propranolol', brandName: 'Inderal', category: 'Beta Blocker', commonDoses: ['1mg/ml'] },
    { name: 'Lidocaine', brandName: 'Xylocaine', category: 'Local Anesthetic', commonDoses: ['2%'] },
    { name: 'Bupivacaine', brandName: 'Marcaine', category: 'Local Anesthetic', commonDoses: ['0.25%', '0.5%'] },
    
    // Herbal/Alternative Medications
    { name: 'Milk Thistle', brandName: 'Silymarin', category: 'Herbal', commonDoses: ['Various'] },
    { name: 'Cranberry Extract', brandName: 'Cranberry', category: 'Supplement', commonDoses: ['Various'] },
    { name: 'Echinacea', brandName: 'Echinacea', category: 'Herbal', commonDoses: ['Various'] },
    { name: 'Ginkgo Biloba', brandName: 'Ginkgo', category: 'Herbal', commonDoses: ['Various'] },
    { name: 'Turmeric', brandName: 'Curcumin', category: 'Anti-inflammatory', commonDoses: ['Various'] },
    { name: 'CBD Oil', brandName: 'Cannabidiol', category: 'Alternative', commonDoses: ['Various'] }
  ]
};

// Search function for medication autocomplete
export const searchMedications = (query, species = 'all') => {
  if (!query || query.length < 2) return [];
  
  const searchQuery = query.toLowerCase();
  let medications = [...commonMedications.all];
  
  if (species === 'dog') {
    medications = [...medications, ...commonMedications.dog];
  } else if (species === 'cat') {
    medications = [...medications, ...commonMedications.cat];
  } else {
    medications = [...medications, ...commonMedications.dog, ...commonMedications.cat];
  }
  
  // Remove duplicates based on name
  const uniqueMedications = medications.filter((med, index, self) => 
    index === self.findIndex(m => m.name === med.name)
  );
  
  return uniqueMedications
    .filter(med => 
      (med.name && med.name.toLowerCase().includes(searchQuery)) || 
      (med.brandName && med.brandName.toLowerCase().includes(searchQuery)) ||
      (med.category && med.category.toLowerCase().includes(searchQuery))
    )
    .map(med => ({
      ...med,
      displayName: med.name // Only show generic name in search results
    }))
    .slice(0, 15); // Increased to 15 results
};

// Get common doses for a medication
export const getCommonDoses = (medicationName) => {
  const allMeds = [...commonMedications.all, ...commonMedications.dog, ...commonMedications.cat];
  const medication = allMeds.find(med => 
    med.name.toLowerCase() === medicationName.toLowerCase() ||
    med.brandName.toLowerCase() === medicationName.toLowerCase()
  );
  
  return medication ? medication.commonDoses : [];
};

// Function to submit medication request
export const submitMedicationRequest = async (medicationData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/medications/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(medicationData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting medication request:', error);
    throw error;
  }
}; 