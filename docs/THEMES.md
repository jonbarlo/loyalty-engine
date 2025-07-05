# 🎨 Theme System Documentation

## Overview

The Theme System enables dynamic white-label theming for the Loyalty Engine, allowing each business to have its own custom visual identity. This system supports comprehensive theming including colors, typography, spacing, and UI elements.

## 🏗️ Architecture

### Database Schema

The theme system uses a dedicated `themes` table with the following structure:

```sql
CREATE TABLE themes (
  id INT PRIMARY KEY IDENTITY(1,1),
  businessId INT NOT NULL,
  primaryColor VARCHAR(7) NOT NULL,
  secondaryColor VARCHAR(7) NOT NULL,
  backgroundColor VARCHAR(7) NOT NULL,
  errorColor VARCHAR(7) NOT NULL,
  textPrimaryColor VARCHAR(7) NOT NULL,
  onPrimaryColor VARCHAR(7) NOT NULL,
  fontFamily VARCHAR(50) NOT NULL,
  fontSizeBody INT NOT NULL,
  fontSizeHeading INT NOT NULL,
  fontSizeCaption INT NOT NULL,
  fontWeightRegular INT NOT NULL,
  fontWeightBold INT NOT NULL,
  defaultPadding INT NOT NULL,
  defaultMargin INT NOT NULL,
  borderRadius INT NOT NULL,
  elevation INT NOT NULL,
  isActive BIT DEFAULT 1,
  createdAt DATETIME2 DEFAULT GETDATE(),
  updatedAt DATETIME2 DEFAULT GETDATE()
);
```

### Key Features

- **Business-Specific Themes**: Each business can have its own unique theme
- **Role-Based Access**: Only admins and business owners can manage themes
- **Validation**: Comprehensive input validation with detailed error messages
- **Default Theme**: Fallback theme template for new businesses
- **Active/Inactive**: Support for theme versioning and A/B testing

## 🔌 API Endpoints

### Get Business Theme
```http
GET /businesses/:id/themes
```

**Response:**
```json
{
  "id": 1,
  "businessId": 1,
  "primaryColor": "#4F46E5",
  "secondaryColor": "#6366F1",
  "backgroundColor": "#FFFFFF",
  "errorColor": "#EF4444",
  "textPrimaryColor": "#1F2937",
  "onPrimaryColor": "#FFFFFF",
  "fontFamily": "RobotoFlex",
  "fontSizeBody": 16,
  "fontSizeHeading": 24,
  "fontSizeCaption": 12,
  "fontWeightRegular": 400,
  "fontWeightBold": 700,
  "defaultPadding": 16,
  "defaultMargin": 8,
  "borderRadius": 12,
  "elevation": 4,
  "isActive": true,
  "createdAt": "2025-07-04T05:30:00.000Z",
  "updatedAt": "2025-07-04T05:30:00.000Z"
}
```

### Create/Update Theme
```http
POST /businesses/:id/themes
Authorization: Bearer <admin_or_owner_token>
```

**Request Body:**
```json
{
  "primaryColor": "#4F46E5",
  "secondaryColor": "#6366F1",
  "backgroundColor": "#FFFFFF",
  "errorColor": "#EF4444",
  "textPrimaryColor": "#1F2937",
  "onPrimaryColor": "#FFFFFF",
  "fontFamily": "RobotoFlex",
  "fontSizeBody": 16,
  "fontSizeHeading": 24,
  "fontSizeCaption": 12,
  "fontWeightRegular": 400,
  "fontWeightBold": 700,
  "defaultPadding": 16,
  "defaultMargin": 8,
  "borderRadius": 12,
  "elevation": 4
}
```

### Update Theme
```http
PUT /businesses/:id/themes
Authorization: Bearer <admin_or_owner_token>
```

### Delete Theme
```http
DELETE /businesses/:id/themes
Authorization: Bearer <admin_or_owner_token>
```

### Get Default Theme Template
```http
GET /themes/default
```

**Response:**
```json
{
  "message": "Default theme template",
  "template": {
    "primaryColor": "#4F46E5",
    "secondaryColor": "#6366F1",
    "backgroundColor": "#FFFFFF",
    "errorColor": "#EF4444",
    "textPrimaryColor": "#1F2937",
    "onPrimaryColor": "#FFFFFF",
    "fontFamily": "RobotoFlex",
    "fontSizeBody": 16,
    "fontSizeHeading": 24,
    "fontSizeCaption": 12,
    "fontWeightRegular": 400,
    "fontWeightBold": 700,
    "defaultPadding": 16,
    "defaultMargin": 8,
    "borderRadius": 12,
    "elevation": 4
  }
}
```

## 🎯 Theme Properties

### Colors
| Property | Type | Description | Validation |
|----------|------|-------------|------------|
| `primaryColor` | String | Main brand color | Hex color (#RRGGBB) |
| `secondaryColor` | String | Secondary brand color | Hex color (#RRGGBB) |
| `backgroundColor` | String | Background color | Hex color (#RRGGBB) |
| `errorColor` | String | Error state color | Hex color (#RRGGBB) |
| `textPrimaryColor` | String | Primary text color | Hex color (#RRGGBB) |
| `onPrimaryColor` | String | Text on primary color | Hex color (#RRGGBB) |

### Typography
| Property | Type | Description | Validation |
|----------|------|-------------|------------|
| `fontFamily` | String | Font family name | 1-50 characters |
| `fontSizeBody` | Integer | Body text size | 8-32 pixels |
| `fontSizeHeading` | Integer | Heading text size | 16-48 pixels |
| `fontSizeCaption` | Integer | Caption text size | 8-16 pixels |
| `fontWeightRegular` | Integer | Regular font weight | 100-900 |
| `fontWeightBold` | Integer | Bold font weight | 100-900 |

### Spacing & Layout
| Property | Type | Description | Validation |
|----------|------|-------------|------------|
| `defaultPadding` | Integer | Default padding | 0-64 pixels |
| `defaultMargin` | Integer | Default margin | 0-64 pixels |
| `borderRadius` | Integer | Border radius | 0-32 pixels |
| `elevation` | Integer | Shadow elevation | 0-24 pixels |

## 🔐 Authentication & Authorization

### Required Roles
- **Admin**: Full access to all themes
- **Business Owner**: Access to themes for their own business
- **Customer**: Read-only access to their business theme

### Authorization Flow
1. User must be authenticated with valid JWT token
2. Token must contain `role` and `businessId` claims
3. Business owners can only access themes for their own business
4. Admins can access themes for any business

## 🧪 Testing

### Test Coverage
- ✅ **ThemeController.spec.ts**: 8 tests passing
- ✅ **themeService.spec.ts**: 8 tests passing
- ✅ **Total Theme Tests**: 16 tests

### Test Categories
- CRUD operations
- Authorization and role-based access
- Input validation
- Error handling
- Business isolation

### Running Theme Tests
```bash
# Run only theme tests
npm test -- --testPathPattern="ThemeController|themeService"

# Run all tests
npm test
```

## 🚀 Integration Guide

### Flutter App Integration

1. **Fetch Theme on App Start**
```dart
Future<ThemeData> fetchBusinessTheme(int businessId) async {
  final response = await http.get(
    Uri.parse('$apiUrl/businesses/$businessId/themes'),
    headers: {'Authorization': 'Bearer $token'},
  );
  
  if (response.statusCode == 200) {
    final themeData = json.decode(response.body);
    return ThemeData.fromJson(themeData);
  }
  
  // Fallback to default theme
  return defaultTheme;
}
```

2. **Apply Theme to MaterialApp**
```dart
MaterialApp(
  theme: businessTheme,
  // ... other app configuration
)
```

### Admin Dashboard Integration

1. **Theme Editor Component**
```javascript
const ThemeEditor = ({ businessId }) => {
  const [theme, setTheme] = useState(null);
  
  const saveTheme = async (themeData) => {
    await fetch(`/businesses/${businessId}/themes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(themeData)
    });
  };
  
  return (
    <div>
      <ColorPicker value={theme?.primaryColor} onChange={...} />
      <FontSelector value={theme?.fontFamily} onChange={...} />
      <SpacingControls value={theme?.defaultPadding} onChange={...} />
    </div>
  );
};
```

## 📊 Performance Considerations

### Caching Strategy
- Cache themes in memory for frequently accessed businesses
- Implement cache invalidation on theme updates
- Use CDN for static theme assets

### Database Optimization
- Index on `businessId` for fast lookups
- Consider theme versioning for A/B testing
- Archive inactive themes

## 🔧 Development

### Adding New Theme Properties

1. **Update Database Schema**
```sql
ALTER TABLE themes ADD newProperty VARCHAR(50);
```

2. **Update Model**
```typescript
// src/models/ThemeModel.ts
newProperty: {
  type: DataTypes.STRING(50),
  allowNull: false,
  validate: {
    len: [1, 50]
  }
}
```

3. **Update Service Validation**
```typescript
// src/services/themeService.ts
const validateTheme = (themeData: any) => {
  // Add validation for new property
  if (!themeData.newProperty) {
    throw new Error('newProperty is required');
  }
};
```

4. **Update Tests**
```typescript
// Add test cases for new property
it('should validate newProperty', async () => {
  // Test implementation
});
```

### Migration Scripts

Run theme-related migrations:
```bash
# Run all migrations
npm run migrate

# Run specific migration
npm run migrate:run -- 20250704000000-add-themes-table
```

## 🐛 Troubleshooting

### Common Issues

1. **Theme Not Loading**
   - Check business ID in request
   - Verify authentication token
   - Ensure theme exists for business

2. **Validation Errors**
   - Check color format (must be hex #RRGGBB)
   - Verify font size ranges
   - Ensure all required fields are present

3. **Authorization Errors**
   - Verify user role (admin or business_owner)
   - Check business ownership for business_owner role
   - Ensure valid JWT token

### Debug Endpoints

```http
# Check theme existence
GET /businesses/:id/themes

# Get default theme
GET /themes/default

# Health check
GET /health
```

## 📈 Future Enhancements

### Planned Features
- **Theme Templates**: Pre-built theme collections
- **Theme Versioning**: Support for theme history and rollback
- **A/B Testing**: Multiple active themes per business
- **Theme Import/Export**: Bulk theme management
- **Real-time Preview**: Live theme preview in admin dashboard

### API Extensions
- `GET /themes/templates` - Get available theme templates
- `POST /businesses/:id/themes/duplicate` - Duplicate existing theme
- `GET /businesses/:id/themes/history` - Get theme version history
- `POST /businesses/:id/themes/rollback/:version` - Rollback to previous version

## 📞 Support

For theme system support:
- Check the API documentation at `/api-docs`
- Review test cases in `src/controllers/ThemeController.spec.ts`
- Consult the validation rules in `src/services/themeService.ts`

## 📋 Quick Reference

### Complete Theme Endpoints

| Endpoint | Method | Description | Tags |
|----------|--------|-------------|------|
| `/businesses/{id}/themes` | GET | Get theme for a business | Themes |
| `/businesses/{id}/themes` | POST | Create/update theme | Themes |
| `/businesses/{id}/themes` | PUT | Update theme | Themes |
| `/businesses/{id}/themes` | DELETE | Delete theme | Themes |
| `/themes/default` | GET | Get default theme template | Themes |

### Theme Schema Properties

**Colors:**
- `primaryColor`, `secondaryColor`, `backgroundColor`, `errorColor`, `textPrimaryColor`, `onPrimaryColor`

**Typography:**
- `fontFamily`, `fontSizeBody`, `fontSizeHeading`, `fontSizeCaption`, `fontWeightRegular`, `fontWeightBold`

**Layout:**
- `defaultPadding`, `defaultMargin`, `borderRadius`, `elevation`

**Metadata:**
- `id`, `businessId`, `isActive`, `createdAt`, `updatedAt`

## 🎯 Summary

The Theme System provides a comprehensive solution for dynamic white-label theming in the Loyalty Engine. With full CRUD operations, role-based access control, comprehensive validation, and extensive documentation, it enables businesses to create unique visual identities while maintaining consistency and security.

### Key Benefits:
- ✅ **Production Ready**: Fully tested and documented
- ✅ **Scalable**: Supports unlimited businesses with unique themes
- ✅ **Secure**: Role-based access control and input validation
- ✅ **Flexible**: Comprehensive theming options for colors, typography, and layout
- ✅ **Well Documented**: Complete API documentation and integration guides

### Next Steps:
1. **Frontend Integration**: Implement theme fetching in your Flutter app
2. **Admin Dashboard**: Create theme editor components
3. **Testing**: Verify theme functionality in your development environment
4. **Deployment**: Deploy to production and test with real business data

---

**Last Updated**: July 4, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Maintainer**: Loyalty Engine Team

