document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('promptForm');
    const generateBtn = document.getElementById('generateBtn');
    const outputSection = document.getElementById('outputSection');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Helper function to set nested object value
    function setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    // Helper function to handle array fields (comma-separated)
    function processValue(value, fieldName) {
        if (!value || value.trim() === '') return null;
        
        // Fields that should be arrays
        const arrayFields = [
            'visual_style.aesthetic_keywords',
            'visual_style.color_palette',
            'subjects_and_elements.main_subject.accessories',
            'subjects_and_elements.secondary_elements',
            'subjects_and_elements.symbolic_elements',
            'subjects_and_elements.props',
            'text_content.supporting_points',
            'constraints.content_restrictions',
            'negative_prompt.excluded_styles',
            'negative_prompt.excluded_colors',
            'negative_prompt.excluded_elements',
            'negative_prompt.quality_issues'
        ];

        if (arrayFields.includes(fieldName)) {
            return value.split(',').map(item => item.trim()).filter(item => item !== '');
        }
        
        return value.trim();
    }

    generateBtn.addEventListener('click', function() {
        const formData = new FormData(form);
        const jsonData = {
            type: "ai_image_generation_prompt",
            purpose: "",
            format: "",
            aspect_ratio: "",
            orientation: "",
            language: "",
            subject: "",
            campaign_type: "",
            target_audience: "",
            core_concept: "",
            brand_personality: "",
            emotional_goal: "",
            scene_description: "",
            narrative_context: "",
            visual_style: {
                design_trend: "",
                style_reference: "",
                art_direction: "",
                aesthetic_keywords: [],
                color_palette: [],
                color_psychology: "",
                background: {
                    type: "",
                    texture: "",
                    gradient: "",
                    environment: ""
                },
                composition: {
                    layout: "",
                    grid_system: "",
                    visual_hierarchy: "",
                    focal_point: "",
                    negative_space: "",
                    balance: "",
                    depth: ""
                },
                lighting: {
                    type: "",
                    mood: "",
                    key_light: "",
                    fill_light: "",
                    rim_light: "",
                    shadow_style: ""
                },
                effects: {
                    glow: "",
                    blur: "",
                    particles: "",
                    reflections: "",
                    atmosphere: ""
                },
                realism_level: "",
                render_style: ""
            },
            subjects_and_elements: {
                main_subject: {
                    type: "",
                    pose: "",
                    expression: "",
                    clothing: "",
                    accessories: [],
                    material: "",
                    texture: ""
                },
                secondary_elements: [],
                symbolic_elements: [],
                props: []
            },
            environment_details: {
                location_type: "",
                time_of_day: "",
                weather: "",
                season: "",
                cultural_context: ""
            },
            text_content: {
                headline: "",
                subheadline: "",
                body_text: "",
                supporting_points: [],
                cta: "",
                contact: {
                    name: "",
                    phone: "",
                    email: "",
                    social_id: "",
                    website: "",
                    location: ""
                }
            },
            typography: {
                font_family: "",
                font_style: "",
                headline_style: "",
                body_style: "",
                font_weight: "",
                letter_spacing: "",
                line_height: "",
                text_alignment: "",
                text_containers: "",
                readability_priority: ""
            },
            branding: {
                logo_presence: "",
                logo_position: "",
                brand_colors_usage: "",
                brand_consistency_rules: ""
            },
            platform_optimization: {
                platform: "",
                safe_zones: "",
                mobile_priority: "",
                compression_tolerance: ""
            },
            quality: {
                resolution: "",
                dpi: "",
                sharpness: "",
                detail_level: "",
                color_accuracy: "",
                noise_level: ""
            },
            output_preferences: {
                style_strength: "",
                creativity_level: "",
                variation_level: "",
                seed_control: ""
            },
            constraints: {
                no_extra_text: true,
                copyright_free: true,
                social_media_safe: true,
                brand_safe: true,
                content_restrictions: []
            },
            negative_prompt: {
                excluded_styles: [],
                excluded_colors: [],
                excluded_elements: [],
                quality_issues: []
            },
            metadata: {
                version: "",
                author: "",
                creation_date: "",
                notes: ""
            }
        };

        // Process all form fields
        for (const [fieldName, value] of formData.entries()) {
            if (fieldName.startsWith('constraints.')) {
                // Handle checkbox fields
                const constraintKey = fieldName.replace('constraints.', '');
                if (constraintKey !== 'content_restrictions') {
                    jsonData.constraints[constraintKey] = true;
                } else {
                    const processedValue = processValue(value, fieldName);
                    if (processedValue) {
                        jsonData.constraints[constraintKey] = processedValue;
                    }
                }
            } else {
                const processedValue = processValue(value, fieldName);
                if (processedValue !== null && processedValue !== '') {
                    setNestedValue(jsonData, fieldName, processedValue);
                }
            }
        }

        // Handle checkboxes that are not checked (set to false)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked && checkbox.name.startsWith('constraints.')) {
                const constraintKey = checkbox.name.replace('constraints.', '');
                if (constraintKey !== 'content_restrictions') {
                    jsonData.constraints[constraintKey] = false;
                }
            }
        });

        // Remove empty strings and empty arrays, keep structure
        function cleanEmptyValues(obj) {
            if (Array.isArray(obj)) {
                return obj.length > 0 ? obj : undefined;
            }
            
            if (obj === null || obj === undefined || obj === '') {
                return undefined;
            }
            
            if (typeof obj === 'object') {
                const cleaned = {};
                for (const key in obj) {
                    const cleanedValue = cleanEmptyValues(obj[key]);
                    if (cleanedValue !== undefined) {
                        cleaned[key] = cleanedValue;
                    }
                }
                return Object.keys(cleaned).length > 0 ? cleaned : undefined;
            }
            
            return obj;
        }

        // Clean the JSON data
        const cleanedData = cleanEmptyValues(jsonData);
        
        // Format JSON with proper indentation
        const jsonString = JSON.stringify(cleanedData, null, 2);
        
        // Display the JSON
        jsonOutput.value = jsonString;
        outputSection.style.display = 'block';
        
        // Scroll to output section
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        jsonOutput.select();
        jsonOutput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(jsonOutput.value).then(function() {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(function() {
                    copyBtn.textContent = 'Copy to Clipboard';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(function() {
                copyBtn.textContent = 'Copy to Clipboard';
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    });
});

