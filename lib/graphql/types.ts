
export interface UserResponse {
  data: {
    user: {
			id: string;
			name: string;
			email: string;
			emailVerified: Date;
			image: string;
			password: string;
			role: string;
			currentOrganizationId: string;
			createdAt: Date | string;
			updatedAt: Date | string;
			isTwoFactorEnabled: boolean;
			twoFactorConfirmationId: string;
		};
  }
};

export interface UserVariables {
  id: string;
};

export interface UserByAccountResponse {
  data: {
    userByAccount: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
    image: string;
    password: string;
    role: string;
    currentOrganizationId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    isTwoFactorEnabled: boolean;
    twoFactorConfirmationId: string;
  };
  }
};

export interface UserByAccountVariables {
  provider: string;
  providerAccountId: string;
};

export interface UserByEmailResponse {
  data: {
    userByEmail: {
			id: string;
			name: string;
			email: string;
			emailVerified: string;
			image: string;
			password: string;
			role: string;
			currentOrganizationId: string;
			createdAt: Date | string;
			updatedAt: Date | string;
			isTwoFactorEnabled: boolean;
			twoFactorConfirmationId: string;
		};
  }
};

export interface UserByEmailVariables {
  email: string;
};

export interface VerificationCodeByCodeResponse {
  data: {
    verificationCodeByCode: {
      id: string;
      email: string;
      code: string;
      expires: string;
    };
  }
};

export interface VerificationCodeByCodeVariables {
  code: string;
};

export interface VerificationCodeByEmailResponse {
  data: {
    verificationCodeByEmail: {
      id: string;
      email: string;
      code: string;
      expires: string;
    };
  }
};

export interface VerificationCodeByEmailVariables {
  email: string;
};

export interface OrganizationResponse {
  data: {
    organization: {
      id: string;
      name: string;
      description: string;
      widgetStyle: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }
};

export interface OrganizationVariables {
  organizationId: string;
};

export interface UserOrganizationsByUserIdResponse {
  data: {
    userOrganizationsByUserId: Array<{
      id: string;
      name: string;
      description: string;
      widgetStyle: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    }>;
  }
};

export interface UserOrganizationsByUserIdVariables {
  userId: string;
};

export interface DashboardStatsResponse {
  data: {
    dashboardStats: {
      stats: {
        totalFeedback: number;
        openFeedback: number;
        resolvedFeedback: number;
        averageRating: number;
        totalFeedbackChange: number;
        openFeedbackChange: number;
        resolvedFeedbackChange: number;
        averageRatingChange: number;
      };
      charts: {
        feedbackThisWeek: {
          name: string;
          count: number;
        }[]
      }
    };
  }
};

export interface DashboardStatsVariables {
  organizationId: string;
};

export interface FeedbackByOrganizationIdAndFeedbackIdResponse {
  data: {
    feedbackByOrganizationIdAndFeedbackId: {
      id: string;
      organizationId: string;
      type: string;
      rating: number;
      description: string;
      analysis: string;
      sentiment: string;
      isResolved: boolean;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  };
};

export interface FeedbackByOrganizationIdAndFeedbackIdVariables {
  organizationId: string;
  feedbackId: string;
};

export interface FeedbackByFeedbackIdResponse {
  data: {
    feedbackByFeedbackId: {
    id: string;
    organizationId: string;
    type: string;
    rating: number;
    description: string;
    analysis: string;
    sentiment: string;
    isResolved: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  }
};

export interface FeedbackByFeedbackIdVariables {
  feedbackId: string;
};

export interface FeedbacksByOrganizationIdResponse {
  data: {
    feedbacksByOrganizationId: Array<{
      id: string;
      organizationId: string;
      type: string;
      rating: number;
      description: string;
      analysis: string;
      sentiment: string;
      isResolved: boolean;
      createdAt: Date | string;
      updatedAt: Date | string;
    }>;
  }
};

export interface FeedbacksByOrganizationIdVariables {
  organizationId: string;
};

export interface PasswordResetTokenByTokenResponse {
  data: {
    passwordResetTokenByToken: {
      id: string;
      email: string;
      token: string;
      expires: string;
    };
  }
};

export interface PasswordResetTokenByTokenVariables {
  token: string;
};

/**
 * 
 * For Mutations...
 */
export interface LinkAccountResponse {
  data: {
    linkAccount: {
      id: string;
      userId: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token: string;
      access_token: string;
      expires_at: number;
      token_type: string;
      scope: string;
      id_token: string;
      session_state: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }
};

export interface LinkAccountVariables {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
};

export interface CreateUserResponse {
  data: {
    createUser: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date;
      image: string;
      password: string;
      role: string;
      currentOrganizationId: string;
      createdAt: Date | string;
      updatedAt: Date | string;
      isTwoFactorEnabled: boolean;
      twoFactorConfirmationId: string;
    };
  }
};

export interface CreateUserVariables {
  name: string;
  email: string;
  password: string;
  currentOrganizationId: string;
};

export interface UpdateUserResponse {
  data: {
    updateUser: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date;
      image: string;
      password: string;
      role: string;
      currentOrganizationId: string;
      createdAt: Date | string;
      updatedAt: Date | string;
      isTwoFactorEnabled: boolean;
      twoFactorConfirmationId: string;
    };
  }
};

export interface UpdateUserVariables {
  userId: string;
  name: string | null;
  email: string | null;
  password: string | null;
  currentOrganizationId: string | null;
  emailVerified: string | null;
  image: string | null;
  isTwoFactorEnabled: number | null;
  twoFactorConfirmationId: string | null;
};

export interface CreateOrganizationResponse {
  data: {
    createOrganization: {
      id: string;
      name: string;
      description: string;
      widgetStyle: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }
};

export interface CreateOrganizationVariables {
  firstName: string;
};

export interface UpdateOrganizationResponse {
  data: {
    updateOrganization: {
      id: string;
      name: string;
      description: string;
      widgetStyle: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }
};

export interface UpdateOrganizationVariables {
  organizationId: string;
  name: string | null;
  description: string | null;
  widgetStyle: string | null;
};

export interface CreateMembershipResponse {
  data: {
    createMembership: {
      organizationId: string;
      userId: string;
      role: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }
};

export interface CreateMembershipVariables {
  organizationId: string;
  userId: string;
  role: string;
};

export interface GenerateVerificationCodeResponse {
  data: {
    generateVerificationCode: {
      id: string;
      email: string;
      code: string;
      expires: string;
    };
  }
};

export interface GenerateVerificationCodeVariables {
  email: string;
};

export interface GeneratePasswordResetTokenResponse {
  data: {
    generatePasswordResetToken: {
      id: string;
      email: string;
      token: string;
      expires: string;
    };
  }
};

export interface GeneratePasswordResetTokenVariables {
  email: string;
};

export interface DeleteVerificationCodeResponse {
  data: {
    deleteVerificationCode: boolean;
  }
};

export interface DeleteVerificationCodeVariables {
  codeId: string;
};

export interface CreateFeedbackResponse {
  data: {
    createFeedback: {
      id: string;
      organizationId: string;
      rating: number;
      description: string;
      analysis: string;
      sentiment: string;
      isResolved: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }
};

export interface CreateFeedbackVariables {
  rating: number;
  description: string;
  organizationId: string;
};

export interface DeletePasswordResetTokenResponse {
  data: {
    deletePasswordResetToken: boolean;
  }
};

export interface DeletePasswordResetTokenVariables {
  id: string;
};
